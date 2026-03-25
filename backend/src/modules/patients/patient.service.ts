import type { PhoneType, Prisma } from '../../generated/prisma/client.js';
import prisma from '../../config/db.js';
import { ApiError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import { PATIENTS } from '../../shared/constants/index.js';
import type {
  CreatePatientInput,
  DeletePatientInput,
  ListPatientsQueryInput,
  UpdatePatientInput,
} from './patient.schema.js';

const toDateOnly = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

const isBlank = (value: string | undefined | null): boolean => !value || value.trim().length === 0;

const generatePatientCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < 10; attempt++) {
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const code = `${PATIENTS.CODE_PREFIX}-${Date.now()}-${randomPart}`;

    const existing = await prisma.patient.findUnique({
      where: { patientCode: code },
      select: { id: true },
    });
    if (!existing) {
      return code;
    }
  }

  throw new ValidationError('Unable to generate unique patient code. Please retry.');
};

const assertBranchExists = async (branchId: number): Promise<void> => {
  const branch = await prisma.branch.findUnique({ where: { id: branchId }, select: { id: true } });
  if (!branch) {
    throw new NotFoundError('Branch not found');
  }
};

const includePayload = {
  branch: { select: { id: true, name: true, code: true } },
  address: true,
  phoneNumbers: { orderBy: { id: 'asc' as const } },
  emergencyContact: true,
  insuranceInfo: true,
  additionalInfo: true,
  deletedByUser: { select: { id: true, email: true } },
};

const findActiveDuplicatePatient = async (params: {
  fullName: string;
  dateOfBirth: Date;
  branchId: number;
  primaryPhoneNumber: string;
  excludePatientId?: number;
}) => {
  return prisma.patient.findFirst({
    where: {
      fullName: params.fullName,
      dateOfBirth: params.dateOfBirth,
      branchId: params.branchId,
      deletedAt: null,
      phoneNumbers: {
        some: {
          isPrimary: true,
          phoneNumber: params.primaryPhoneNumber,
        },
      },
      ...(params.excludePatientId ? { NOT: { id: params.excludePatientId } } : {}),
    },
    select: {
      id: true,
      patientCode: true,
      fullName: true,
      dateOfBirth: true,
      branchId: true,
      phoneNumbers: {
        where: { isPrimary: true },
        select: { phoneNumber: true, phoneType: true },
      },
    },
  });
};

const upsertPhoneByType = async (
  tx: Prisma.TransactionClient,
  patientId: number,
  phoneType: PhoneType,
  phoneNumber: string,
  isPrimary: boolean,
) => {
  await tx.patientPhoneNumber.upsert({
    where: {
      patientId_phoneType: {
        patientId,
        phoneType,
      },
    },
    create: {
      patientId,
      phoneType,
      phoneNumber,
      isPrimary,
    },
    update: {
      phoneNumber,
      isPrimary,
    },
  });
};

const hasInsuranceData = (
  input: UpdatePatientInput['insuranceInfo'] | CreatePatientInput['insuranceInfo'],
) => {
  return Boolean(
    input &&
    (!isBlank(input.healthCardNumber) ||
      !isBlank(input.healthCardVisionCode) ||
      !isBlank(input.preferredDoctor) ||
      input.expiryDate),
  );
};

const hasAdditionalInfo = (
  input: UpdatePatientInput['additionalInfo'] | CreatePatientInput['additionalInfo'],
) => {
  return Boolean(
    input &&
    (!isBlank(input.guardian) || !isBlank(input.referredBy) || !isBlank(input.patientNote)),
  );
};

export const createPatient = async (input: CreatePatientInput) => {
  const normalizedFullName = input.fullName.trim();
  const dob = toDateOnly(input.dateOfBirth);
  const primaryPhone = input.contactDetails.phoneNumber.trim();

  await assertBranchExists(input.branchId);

  const duplicate = await findActiveDuplicatePatient({
    fullName: normalizedFullName,
    dateOfBirth: dob,
    branchId: input.branchId,
    primaryPhoneNumber: primaryPhone,
  });

  if (duplicate && !input.duplicateOverride) {
    throw new ApiError('Potential duplicate patient detected', 409, [
      {
        code: 'DUPLICATE_PATIENT',
        message:
          'An active patient already exists with the same full name, date of birth, primary phone number, and branch.',
        existingPatient: duplicate,
        canOverride: true,
      },
    ]);
  }

  const patientCode = await generatePatientCode();

  const created = await prisma.patient.create({
    data: {
      patientCode,
      fullName: normalizedFullName,
      dateOfBirth: dob,
      gender: input.gender,
      branchId: input.branchId,
      registrationDate: input.registrationDate ? toDateOnly(input.registrationDate) : undefined,
      address: input.address
        ? {
            create: {
              addressLine1: input.address.addressLine1.trim(),
              addressLine2: input.address.addressLine2?.trim() || null,
              city: input.address.city?.trim() || null,
              province: input.address.province?.trim() || null,
              postalCode: input.address.postalCode?.trim() || null,
            },
          }
        : undefined,
      phoneNumbers: {
        create: [
          {
            phoneType: 'MOBILE',
            phoneNumber: primaryPhone,
            isPrimary: true,
          },
          ...(input.contactDetails.businessPhone
            ? [
                {
                  phoneType: 'BUSINESS' as const,
                  phoneNumber: input.contactDetails.businessPhone.trim(),
                  isPrimary: false,
                },
              ]
            : []),
          ...(input.contactDetails.additionalPhone
            ? [
                {
                  phoneType: 'ADDITIONAL' as const,
                  phoneNumber: input.contactDetails.additionalPhone.trim(),
                  isPrimary: false,
                },
              ]
            : []),
        ],
      },
      emergencyContact: input.emergencyContact
        ? {
            create: {
              fullName: input.emergencyContact.fullName.trim(),
              relationship: input.emergencyContact.relationship?.trim() || null,
              contactNumber: input.emergencyContact.contactNumber.trim(),
              addressLine1: input.emergencyContact.addressLine1?.trim() || null,
              addressLine2: input.emergencyContact.addressLine2?.trim() || null,
              city: input.emergencyContact.city?.trim() || null,
              province: input.emergencyContact.province?.trim() || null,
              postalCode: input.emergencyContact.postalCode?.trim() || null,
            },
          }
        : undefined,
      insuranceInfo:
        input.insuranceInfo && hasInsuranceData(input.insuranceInfo)
          ? {
              create: {
                healthCardNumber: input.insuranceInfo.healthCardNumber?.trim() || null,
                healthCardVisionCode: input.insuranceInfo.healthCardVisionCode?.trim() || null,
                expiryDate: input.insuranceInfo.expiryDate
                  ? toDateOnly(input.insuranceInfo.expiryDate)
                  : null,
                preferredDoctor: input.insuranceInfo.preferredDoctor?.trim() || null,
              },
            }
          : undefined,
      additionalInfo:
        input.additionalInfo && hasAdditionalInfo(input.additionalInfo)
          ? {
              create: {
                guardian: input.additionalInfo.guardian?.trim() || null,
                referredBy: input.additionalInfo.referredBy?.trim() || null,
                patientNote: input.additionalInfo.patientNote?.trim() || null,
              },
            }
          : undefined,
    },
    include: includePayload,
  });

  return {
    patient: created,
    duplicateWarningAcknowledged: Boolean(duplicate && input.duplicateOverride),
  };
};

export const listPatients = async (query: ListPatientsQueryInput) => {
  const where: Prisma.PatientWhereInput = {
    deletedAt: query.includeDeleted ? undefined : null,
  };

  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search, mode: 'insensitive' } },
      { patientCode: { contains: query.search, mode: 'insensitive' } },
      {
        phoneNumbers: {
          some: {
            phoneNumber: { contains: query.search, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  if (query.branchId) {
    where.branchId = query.branchId;
  }

  if (query.gender) {
    where.gender = query.gender;
  }

  if (query.registrationDateFrom || query.registrationDateTo) {
    where.registrationDate = {
      gte: query.registrationDateFrom ? toDateOnly(query.registrationDateFrom) : undefined,
      lte: query.registrationDateTo ? toDateOnly(query.registrationDateTo) : undefined,
    };
  }

  const skip = (query.page - 1) * query.limit;

  const [data, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: includePayload,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    }),
    prisma.patient.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getPatientById = async (id: number, includeDeleted: boolean) => {
  const patient = await prisma.patient.findFirst({
    where: {
      id,
      deletedAt: includeDeleted ? undefined : null,
    },
    include: includePayload,
  });

  if (!patient) {
    throw new NotFoundError('Patient not found');
  }

  return patient;
};

export const updatePatient = async (id: number, input: UpdatePatientInput) => {
  const existing = await prisma.patient.findUnique({
    where: { id },
    include: {
      phoneNumbers: true,
    },
  });

  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Active patient not found');
  }

  if (input.branchId) {
    await assertBranchExists(input.branchId);
  }

  const existingPrimaryPhone = existing.phoneNumbers.find((phone) => phone.isPrimary)?.phoneNumber;
  const nextPrimaryPhone = input.contactDetails?.phoneNumber?.trim() || existingPrimaryPhone;

  if (!nextPrimaryPhone) {
    throw new ValidationError('Patient must have a primary phone number');
  }

  const nextFullName = input.fullName?.trim() ?? existing.fullName;
  const nextDob = input.dateOfBirth ? toDateOnly(input.dateOfBirth) : existing.dateOfBirth;
  const nextBranchId = input.branchId ?? existing.branchId;

  const duplicate = await findActiveDuplicatePatient({
    fullName: nextFullName,
    dateOfBirth: nextDob,
    branchId: nextBranchId,
    primaryPhoneNumber: nextPrimaryPhone,
    excludePatientId: id,
  });

  if (duplicate && !input.duplicateOverride) {
    throw new ApiError('Potential duplicate patient detected', 409, [
      {
        code: 'DUPLICATE_PATIENT',
        message:
          'An active patient already exists with the same full name, date of birth, primary phone number, and branch.',
        existingPatient: duplicate,
        canOverride: true,
      },
    ]);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.patient.update({
      where: { id },
      data: {
        fullName: input.fullName?.trim(),
        dateOfBirth: input.dateOfBirth ? toDateOnly(input.dateOfBirth) : undefined,
        gender: input.gender,
        branchId: input.branchId,
        registrationDate: input.registrationDate ? toDateOnly(input.registrationDate) : undefined,
      },
    });

    if (input.address !== undefined) {
      if (input.address === null) {
        await tx.patientAddress.deleteMany({ where: { patientId: id } });
      } else {
        await tx.patientAddress.upsert({
          where: { patientId: id },
          create: {
            patientId: id,
            addressLine1: input.address.addressLine1.trim(),
            addressLine2: input.address.addressLine2?.trim() || null,
            city: input.address.city?.trim() || null,
            province: input.address.province?.trim() || null,
            postalCode: input.address.postalCode?.trim() || null,
          },
          update: {
            addressLine1: input.address.addressLine1.trim(),
            addressLine2: input.address.addressLine2?.trim() || null,
            city: input.address.city?.trim() || null,
            province: input.address.province?.trim() || null,
            postalCode: input.address.postalCode?.trim() || null,
          },
        });
      }
    }

    if (input.contactDetails) {
      if (input.contactDetails.phoneNumber) {
        await upsertPhoneByType(tx, id, 'MOBILE', input.contactDetails.phoneNumber.trim(), true);
      }

      if (input.contactDetails.businessPhone !== undefined) {
        if (!input.contactDetails.businessPhone) {
          await tx.patientPhoneNumber.deleteMany({
            where: { patientId: id, phoneType: 'BUSINESS' },
          });
        } else {
          await upsertPhoneByType(
            tx,
            id,
            'BUSINESS',
            input.contactDetails.businessPhone.trim(),
            false,
          );
        }
      }

      if (input.contactDetails.additionalPhone !== undefined) {
        if (!input.contactDetails.additionalPhone) {
          await tx.patientPhoneNumber.deleteMany({
            where: { patientId: id, phoneType: 'ADDITIONAL' },
          });
        } else {
          await upsertPhoneByType(
            tx,
            id,
            'ADDITIONAL',
            input.contactDetails.additionalPhone.trim(),
            false,
          );
        }
      }
    }

    const primaryAfterUpdate = await tx.patientPhoneNumber.findFirst({
      where: { patientId: id, isPrimary: true },
      select: { id: true },
    });

    if (!primaryAfterUpdate) {
      throw new ValidationError('Patient must have a primary phone number');
    }

    if (input.emergencyContact !== undefined) {
      if (input.emergencyContact === null) {
        await tx.patientEmergencyContact.deleteMany({ where: { patientId: id } });
      } else {
        await tx.patientEmergencyContact.upsert({
          where: { patientId: id },
          create: {
            patientId: id,
            fullName: input.emergencyContact.fullName.trim(),
            relationship: input.emergencyContact.relationship?.trim() || null,
            contactNumber: input.emergencyContact.contactNumber.trim(),
            addressLine1: input.emergencyContact.addressLine1?.trim() || null,
            addressLine2: input.emergencyContact.addressLine2?.trim() || null,
            city: input.emergencyContact.city?.trim() || null,
            province: input.emergencyContact.province?.trim() || null,
            postalCode: input.emergencyContact.postalCode?.trim() || null,
          },
          update: {
            fullName: input.emergencyContact.fullName.trim(),
            relationship: input.emergencyContact.relationship?.trim() || null,
            contactNumber: input.emergencyContact.contactNumber.trim(),
            addressLine1: input.emergencyContact.addressLine1?.trim() || null,
            addressLine2: input.emergencyContact.addressLine2?.trim() || null,
            city: input.emergencyContact.city?.trim() || null,
            province: input.emergencyContact.province?.trim() || null,
            postalCode: input.emergencyContact.postalCode?.trim() || null,
          },
        });
      }
    }

    if (input.insuranceInfo !== undefined) {
      if (input.insuranceInfo === null || !hasInsuranceData(input.insuranceInfo)) {
        await tx.patientInsuranceInfo.deleteMany({ where: { patientId: id } });
      } else {
        await tx.patientInsuranceInfo.upsert({
          where: { patientId: id },
          create: {
            patientId: id,
            healthCardNumber: input.insuranceInfo.healthCardNumber?.trim() || null,
            healthCardVisionCode: input.insuranceInfo.healthCardVisionCode?.trim() || null,
            expiryDate: input.insuranceInfo.expiryDate
              ? toDateOnly(input.insuranceInfo.expiryDate)
              : null,
            preferredDoctor: input.insuranceInfo.preferredDoctor?.trim() || null,
          },
          update: {
            healthCardNumber: input.insuranceInfo.healthCardNumber?.trim() || null,
            healthCardVisionCode: input.insuranceInfo.healthCardVisionCode?.trim() || null,
            expiryDate: input.insuranceInfo.expiryDate
              ? toDateOnly(input.insuranceInfo.expiryDate)
              : null,
            preferredDoctor: input.insuranceInfo.preferredDoctor?.trim() || null,
          },
        });
      }
    }

    if (input.additionalInfo !== undefined) {
      if (input.additionalInfo === null || !hasAdditionalInfo(input.additionalInfo)) {
        await tx.patientAdditionalInfo.deleteMany({ where: { patientId: id } });
      } else {
        await tx.patientAdditionalInfo.upsert({
          where: { patientId: id },
          create: {
            patientId: id,
            guardian: input.additionalInfo.guardian?.trim() || null,
            referredBy: input.additionalInfo.referredBy?.trim() || null,
            patientNote: input.additionalInfo.patientNote?.trim() || null,
          },
          update: {
            guardian: input.additionalInfo.guardian?.trim() || null,
            referredBy: input.additionalInfo.referredBy?.trim() || null,
            patientNote: input.additionalInfo.patientNote?.trim() || null,
          },
        });
      }
    }

    return tx.patient.findUnique({
      where: { id },
      include: includePayload,
    });
  });

  return {
    patient: updated,
    duplicateWarningAcknowledged: Boolean(duplicate && input.duplicateOverride),
  };
};

export const softDeletePatient = async (
  id: number,
  actorUserId: number,
  input: DeletePatientInput,
) => {
  const existing = await prisma.patient.findUnique({ where: { id } });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError('Active patient not found');
  }

  return prisma.patient.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      deletedBy: actorUserId,
      deleteReason: input.reason?.trim() || null,
    },
    include: includePayload,
  });
};

export const restorePatient = async (id: number) => {
  const existing = await prisma.patient.findUnique({
    where: { id },
    include: {
      phoneNumbers: {
        where: { isPrimary: true },
        select: { phoneNumber: true },
      },
    },
  });

  if (!existing || !existing.deletedAt) {
    throw new NotFoundError('Deleted patient not found');
  }

  const primaryPhone = existing.phoneNumbers[0]?.phoneNumber;
  if (!primaryPhone) {
    throw new ValidationError('Cannot restore patient without a primary phone number');
  }

  const conflictingActive = await findActiveDuplicatePatient({
    fullName: existing.fullName,
    dateOfBirth: existing.dateOfBirth,
    branchId: existing.branchId,
    primaryPhoneNumber: primaryPhone,
    excludePatientId: existing.id,
  });

  if (conflictingActive) {
    throw new ApiError('Cannot restore patient due to active duplicate', 409, [
      {
        code: 'ACTIVE_DUPLICATE_EXISTS',
        existingPatient: conflictingActive,
      },
    ]);
  }

  return prisma.patient.update({
    where: { id },
    data: {
      deletedAt: null,
      deletedBy: null,
      deleteReason: null,
    },
    include: includePayload,
  });
};
