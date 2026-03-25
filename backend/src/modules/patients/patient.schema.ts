import { z } from 'zod';

const patientGenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits');

const patientAddressSchema = z.object({
  addressLine1: z.string().trim().min(2).max(255),
  addressLine2: z.string().trim().max(255).optional(),
  city: z.string().trim().max(120).optional(),
  province: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(20).optional(),
});

const patientContactDetailsCreateSchema = z.object({
  phoneNumber: phoneSchema,
  businessPhone: phoneSchema.optional(),
  additionalPhone: phoneSchema.optional(),
});

const patientContactDetailsUpdateSchema = z.object({
  phoneNumber: phoneSchema.optional(),
  businessPhone: phoneSchema.nullable().optional(),
  additionalPhone: phoneSchema.nullable().optional(),
});

const emergencyContactSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  relationship: z.string().trim().max(100).optional(),
  contactNumber: phoneSchema,
  addressLine1: z.string().trim().max(255).optional(),
  addressLine2: z.string().trim().max(255).optional(),
  city: z.string().trim().max(120).optional(),
  province: z.string().trim().max(120).optional(),
  postalCode: z.string().trim().max(20).optional(),
});

const insuranceInfoSchema = z.object({
  healthCardNumber: z.string().trim().max(60).optional(),
  healthCardVisionCode: z.string().trim().max(20).optional(),
  expiryDate: z.string().date().optional(),
  preferredDoctor: z.string().trim().max(150).optional(),
});

const additionalInfoSchema = z.object({
  guardian: z.string().trim().max(150).optional(),
  referredBy: z.string().trim().max(150).optional(),
  patientNote: z.string().trim().max(5000).optional(),
});

export const createPatientSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  dateOfBirth: z.string().date(),
  gender: patientGenderEnum,
  address: patientAddressSchema.optional(),
  contactDetails: patientContactDetailsCreateSchema,
  emergencyContact: emergencyContactSchema.optional(),
  insuranceInfo: insuranceInfoSchema.optional(),
  additionalInfo: additionalInfoSchema.optional(),
  branchId: z.number().int().positive(),
  registrationDate: z.string().date().optional(),
  duplicateOverride: z.boolean().optional().default(false),
});

export const updatePatientSchema = z.object({
  fullName: z.string().trim().min(2).max(150).optional(),
  dateOfBirth: z.string().date().optional(),
  gender: patientGenderEnum.optional(),
  address: patientAddressSchema.nullable().optional(),
  contactDetails: patientContactDetailsUpdateSchema.optional(),
  emergencyContact: emergencyContactSchema.nullable().optional(),
  insuranceInfo: insuranceInfoSchema.nullable().optional(),
  additionalInfo: additionalInfoSchema.nullable().optional(),
  branchId: z.number().int().positive().optional(),
  registrationDate: z.string().date().optional(),
  duplicateOverride: z.boolean().optional().default(false),
});

export const listPatientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  search: z.string().trim().max(150).optional(),
  branchId: z.coerce.number().int().positive().optional(),
  gender: patientGenderEnum.optional(),
  includeDeleted: z.coerce.boolean().optional().default(false),
  registrationDateFrom: z.string().date().optional(),
  registrationDateTo: z.string().date().optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'registrationDate', 'fullName'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const patientIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getPatientByIdQuerySchema = z.object({
  includeDeleted: z.coerce.boolean().optional().default(false),
});

export const deletePatientSchema = z.object({
  reason: z.string().trim().min(3).max(500).optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type ListPatientsQueryInput = z.infer<typeof listPatientsQuerySchema>;
export type PatientIdParamInput = z.infer<typeof patientIdParamSchema>;
export type DeletePatientInput = z.infer<typeof deletePatientSchema>;
