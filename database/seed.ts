import "../backend/node_modules/dotenv/config.js";
// @ts-expect-error Root-level seed references backend-local dependency tree.
import bcrypt from "../backend/node_modules/bcryptjs/index.js";
import prisma from "../backend/src/config/db.js";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@clinic.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
const OPTOMETRIST_EMAIL =
  process.env.SEED_OPTOMETRIST_EMAIL || "optometrist@clinic.local";
const OPTOMETRIST_PASSWORD =
  process.env.SEED_OPTOMETRIST_PASSWORD || "Opto@12345";
const SALT_ROUNDS = 10;

async function seedRoles() {
  const roleNames = ["ADMIN", "CASHIER", "OPTOMETRIST"] as const;

  for (const roleName of roleNames) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }
}

async function seedAdmin() {
  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });
  if (!adminRole) {
    throw new Error("ADMIN role not found. Role seeding failed.");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      roleId: adminRole.id,
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      roleId: adminRole.id,
    },
  });
}

async function seedOptometrist() {
  const optRole = await prisma.role.findUnique({
    where: { name: "OPTOMETRIST" },
  });
  if (!optRole) {
    throw new Error("OPTOMETRIST role not found. Role seeding failed.");
  }

  const passwordHash = await bcrypt.hash(OPTOMETRIST_PASSWORD, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: OPTOMETRIST_EMAIL },
    update: {
      roleId: optRole.id,
    },
    create: {
      email: OPTOMETRIST_EMAIL,
      passwordHash,
      roleId: optRole.id,
    },
  });
}

async function seedBranches() {
  const branches = [
    { code: "MAIN", name: "Main Branch", address: "Colombo" },
    { code: "NORTH", name: "North Branch", address: "Jaffna" },
    { code: "SOUTH", name: "South Branch", address: "Galle" },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: {
        name: branch.name,
        address: branch.address,
      },
      create: branch,
    });
  }
}

async function seedPatients() {
  const branches = await prisma.branch.findMany({
    select: { id: true, code: true },
  });
  const branchMap = Object.fromEntries(branches.map((b) => [b.code, b.id]));

  const patients = [
    {
      fullName: "Amal Perera",
      dateOfBirth: "1990-03-15",
      gender: "MALE" as const,
      branchCode: "MAIN",
      phone: "0771234501",
      address: {
        addressLine1: "12 Galle Road",
        city: "Colombo",
        province: "Western",
        postalCode: "00300",
      },
      insurance: {
        healthCardNumber: "HC-10001",
        expiryDate: "2027-06-30",
        preferredDoctor: "Dr. Silva",
      },
      emergency: {
        fullName: "Nimal Perera",
        relationship: "Father",
        contactNumber: "0771234600",
      },
    },
    {
      fullName: "Kumari Fernando",
      dateOfBirth: "1985-07-22",
      gender: "FEMALE" as const,
      branchCode: "MAIN",
      phone: "0771234502",
      address: {
        addressLine1: "45 Duplication Road",
        city: "Colombo",
        province: "Western",
        postalCode: "00400",
      },
      insurance: {
        healthCardNumber: "HC-10002",
        expiryDate: "2026-12-31",
        preferredDoctor: "Dr. Jayawardena",
      },
      emergency: {
        fullName: "Sunil Fernando",
        relationship: "Husband",
        contactNumber: "0771234601",
      },
    },
    {
      fullName: "Ruwan Jayasuriya",
      dateOfBirth: "1978-11-05",
      gender: "MALE" as const,
      branchCode: "NORTH",
      phone: "0771234503",
      address: {
        addressLine1: "78 Hospital Road",
        city: "Jaffna",
        province: "Northern",
        postalCode: "40000",
      },
      insurance: {
        healthCardNumber: "HC-10003",
        expiryDate: "2025-01-15",
        preferredDoctor: "Dr. Ramanathan",
      },
      emergency: {
        fullName: "Dilani Jayasuriya",
        relationship: "Wife",
        contactNumber: "0771234602",
      },
    },
    {
      fullName: "Sachini Weerasinghe",
      dateOfBirth: "2000-01-28",
      gender: "FEMALE" as const,
      branchCode: "SOUTH",
      phone: "0771234504",
      address: {
        addressLine1: "23 Lighthouse Street",
        city: "Galle",
        province: "Southern",
        postalCode: "80000",
      },
      insurance: {
        healthCardNumber: "HC-10004",
        expiryDate: "2027-09-30",
        preferredDoctor: "Dr. Silva",
      },
      emergency: {
        fullName: "Kamal Weerasinghe",
        relationship: "Father",
        contactNumber: "0771234603",
      },
    },
    {
      fullName: "Tharindu Bandara",
      dateOfBirth: "1995-06-10",
      gender: "MALE" as const,
      branchCode: "MAIN",
      phone: "0771234505",
      address: {
        addressLine1: "99 Kandy Road",
        city: "Kadawatha",
        province: "Western",
        postalCode: "11850",
      },
      insurance: null,
      emergency: {
        fullName: "Nimali Bandara",
        relationship: "Mother",
        contactNumber: "0771234604",
      },
    },
    {
      fullName: "Fathima Rizna",
      dateOfBirth: "1992-09-18",
      gender: "FEMALE" as const,
      branchCode: "MAIN",
      phone: "0771234506",
      address: {
        addressLine1: "15 Maradana Road",
        city: "Colombo",
        province: "Western",
        postalCode: "01000",
      },
      insurance: {
        healthCardNumber: "HC-10006",
        expiryDate: "2027-03-31",
        preferredDoctor: "Dr. Jayawardena",
      },
      emergency: {
        fullName: "Mohamed Rizwan",
        relationship: "Brother",
        contactNumber: "0771234605",
      },
    },
    {
      fullName: "Dinesh Karunaratne",
      dateOfBirth: "1970-04-02",
      gender: "MALE" as const,
      branchCode: "NORTH",
      phone: "0771234507",
      address: {
        addressLine1: "56 Point Pedro Road",
        city: "Jaffna",
        province: "Northern",
        postalCode: "40000",
      },
      insurance: {
        healthCardNumber: "HC-10007",
        expiryDate: "2024-08-15",
        preferredDoctor: "Dr. Ramanathan",
      },
      emergency: {
        fullName: "Priya Karunaratne",
        relationship: "Daughter",
        contactNumber: "0771234606",
      },
    },
    {
      fullName: "Nadeesha Gunasekara",
      dateOfBirth: "1988-12-25",
      gender: "FEMALE" as const,
      branchCode: "SOUTH",
      phone: "0771234508",
      address: {
        addressLine1: "34 Church Street",
        city: "Galle",
        province: "Southern",
        postalCode: "80000",
      },
      insurance: {
        healthCardNumber: "HC-10008",
        expiryDate: "2026-11-30",
        preferredDoctor: "Dr. Dissanayake",
      },
      emergency: {
        fullName: "Chaminda Gunasekara",
        relationship: "Husband",
        contactNumber: "0771234607",
      },
    },
    {
      fullName: "Lahiru Wickramasinghe",
      dateOfBirth: "2010-02-14",
      gender: "MALE" as const,
      branchCode: "MAIN",
      phone: "0771234509",
      address: {
        addressLine1: "88 Baseline Road",
        city: "Colombo",
        province: "Western",
        postalCode: "00800",
      },
      insurance: {
        healthCardNumber: "HC-10009",
        expiryDate: "2027-12-31",
        preferredDoctor: "Dr. Silva",
      },
      emergency: {
        fullName: "Saman Wickramasinghe",
        relationship: "Father",
        contactNumber: "0771234608",
      },
      additional: { guardian: "Saman Wickramasinghe" },
    },
    {
      fullName: "Iresha Mendis",
      dateOfBirth: "1965-08-30",
      gender: "FEMALE" as const,
      branchCode: "NORTH",
      phone: "0771234510",
      address: {
        addressLine1: "12 Stanley Road",
        city: "Jaffna",
        province: "Northern",
        postalCode: "40000",
      },
      insurance: {
        healthCardNumber: "HC-10010",
        expiryDate: "2025-05-31",
        preferredDoctor: "Dr. Ramanathan",
      },
      emergency: {
        fullName: "Suresh Mendis",
        relationship: "Son",
        contactNumber: "0771234609",
      },
    },
    {
      fullName: "Kasun Rajapaksa",
      dateOfBirth: "1998-05-20",
      gender: "MALE" as const,
      branchCode: "SOUTH",
      phone: "0771234511",
      address: {
        addressLine1: "67 Matara Road",
        city: "Galle",
        province: "Southern",
        postalCode: "80000",
      },
      insurance: null,
      emergency: {
        fullName: "Anoma Rajapaksa",
        relationship: "Mother",
        contactNumber: "0771234610",
      },
    },
    {
      fullName: "Shanika De Silva",
      dateOfBirth: "1982-10-12",
      gender: "FEMALE" as const,
      branchCode: "MAIN",
      phone: "0771234512",
      address: {
        addressLine1: "101 High Level Road",
        city: "Nugegoda",
        province: "Western",
        postalCode: "10250",
      },
      insurance: {
        healthCardNumber: "HC-10012",
        expiryDate: "2026-07-31",
        preferredDoctor: "Dr. Jayawardena",
      },
      emergency: {
        fullName: "Roshan De Silva",
        relationship: "Husband",
        contactNumber: "0771234611",
      },
    },
    {
      fullName: "Harsha Rathnayake",
      dateOfBirth: "1975-01-08",
      gender: "MALE" as const,
      branchCode: "NORTH",
      phone: "0771234513",
      address: {
        addressLine1: "29 KKS Road",
        city: "Jaffna",
        province: "Northern",
        postalCode: "40000",
      },
      insurance: {
        healthCardNumber: "HC-10013",
        expiryDate: "2024-03-31",
        preferredDoctor: "Dr. Ramanathan",
      },
      emergency: {
        fullName: "Malini Rathnayake",
        relationship: "Wife",
        contactNumber: "0771234612",
      },
    },
    {
      fullName: "Gayathri Herath",
      dateOfBirth: "2005-04-17",
      gender: "FEMALE" as const,
      branchCode: "SOUTH",
      phone: "0771234514",
      address: {
        addressLine1: "5 Fort Road",
        city: "Galle",
        province: "Southern",
        postalCode: "80000",
      },
      insurance: {
        healthCardNumber: "HC-10014",
        expiryDate: "2027-08-31",
        preferredDoctor: "Dr. Dissanayake",
      },
      emergency: {
        fullName: "Suresh Herath",
        relationship: "Father",
        contactNumber: "0771234613",
      },
      additional: { guardian: "Suresh Herath" },
    },
    {
      fullName: "Chamara Samarawickrama",
      dateOfBirth: "1993-07-03",
      gender: "MALE" as const,
      branchCode: "MAIN",
      phone: "0771234515",
      address: {
        addressLine1: "42 Havelock Road",
        city: "Colombo",
        province: "Western",
        postalCode: "00500",
      },
      insurance: {
        healthCardNumber: "HC-10015",
        expiryDate: "2027-01-31",
        preferredDoctor: "Dr. Silva",
      },
      emergency: {
        fullName: "Ranjith Samarawickrama",
        relationship: "Father",
        contactNumber: "0771234614",
      },
    },
    {
      fullName: "Nisansala Pathirana",
      dateOfBirth: "1959-12-01",
      gender: "FEMALE" as const,
      branchCode: "MAIN",
      phone: "0771234516",
      address: {
        addressLine1: "77 Negombo Road",
        city: "Wattala",
        province: "Western",
        postalCode: "11300",
      },
      insurance: {
        healthCardNumber: "HC-10016",
        expiryDate: "2025-10-31",
        preferredDoctor: "Dr. Jayawardena",
      },
      emergency: {
        fullName: "Deepa Pathirana",
        relationship: "Daughter",
        contactNumber: "0771234615",
      },
    },
    {
      fullName: "Asanka Gunawardena",
      dateOfBirth: "2015-09-22",
      gender: "MALE" as const,
      branchCode: "NORTH",
      phone: "0771234517",
      address: {
        addressLine1: "18 Temple Road",
        city: "Jaffna",
        province: "Northern",
        postalCode: "40000",
      },
      insurance: {
        healthCardNumber: "HC-10017",
        expiryDate: "2027-04-30",
        preferredDoctor: "Dr. Ramanathan",
      },
      emergency: {
        fullName: "Mahesh Gunawardena",
        relationship: "Father",
        contactNumber: "0771234616",
      },
      additional: { guardian: "Mahesh Gunawardena" },
    },
    {
      fullName: "Ruwanthika Seneviratne",
      dateOfBirth: "1987-06-14",
      gender: "FEMALE" as const,
      branchCode: "SOUTH",
      phone: "0771234518",
      address: {
        addressLine1: "91 Wakwella Road",
        city: "Galle",
        province: "Southern",
        postalCode: "80000",
      },
      insurance: null,
      emergency: {
        fullName: "Lasantha Seneviratne",
        relationship: "Husband",
        contactNumber: "0771234617",
      },
    },
    {
      fullName: "Pradeep Wijesinghe",
      dateOfBirth: "1980-03-29",
      gender: "MALE" as const,
      branchCode: "MAIN",
      phone: "0771234519",
      address: {
        addressLine1: "60 Kotte Road",
        city: "Rajagiriya",
        province: "Western",
        postalCode: "10100",
      },
      insurance: {
        healthCardNumber: "HC-10019",
        expiryDate: "2026-09-30",
        preferredDoctor: "Dr. Silva",
      },
      emergency: {
        fullName: "Sanduni Wijesinghe",
        relationship: "Wife",
        contactNumber: "0771234618",
      },
    },
    {
      fullName: "Chathuri Dissanayake",
      dateOfBirth: "2002-11-07",
      gender: "FEMALE" as const,
      branchCode: "SOUTH",
      phone: "0771234520",
      address: {
        addressLine1: "14 Unawatuna Road",
        city: "Galle",
        province: "Southern",
        postalCode: "80600",
      },
      insurance: {
        healthCardNumber: "HC-10020",
        expiryDate: "2027-02-28",
        preferredDoctor: "Dr. Dissanayake",
      },
      emergency: {
        fullName: "Kumara Dissanayake",
        relationship: "Father",
        contactNumber: "0771234619",
      },
    },
  ];

  let created = 0;
  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];
    const branchId = branchMap[p.branchCode];
    if (!branchId) {
      console.warn(
        `Skipping patient "${p.fullName}": branch "${p.branchCode}" not found.`,
      );
      continue;
    }

    const patientCode = `PT-SEED-${String(i + 1).padStart(3, "0")}`;

    const existing = await prisma.patient.findUnique({
      where: { patientCode },
      select: { id: true },
    });
    if (existing) {
      continue;
    }

    await prisma.patient.create({
      data: {
        patientCode,
        fullName: p.fullName,
        dateOfBirth: new Date(`${p.dateOfBirth}T00:00:00.000Z`),
        gender: p.gender,
        branchId,
        registrationDate:
          new Date(`${p.dateOfBirth.slice(0, 4)}-01-01T00:00:00.000Z`) >
          new Date("2023-01-01")
            ? new Date()
            : new Date(
                `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
              ),
        address: p.address
          ? {
              create: {
                addressLine1: p.address.addressLine1,
                city: p.address.city,
                province: p.address.province,
                postalCode: p.address.postalCode,
              },
            }
          : undefined,
        phoneNumbers: {
          create: [
            { phoneType: "MOBILE", phoneNumber: p.phone, isPrimary: true },
          ],
        },
        emergencyContact: p.emergency
          ? {
              create: {
                fullName: p.emergency.fullName,
                relationship: p.emergency.relationship,
                contactNumber: p.emergency.contactNumber,
              },
            }
          : undefined,
        insuranceInfo: p.insurance
          ? {
              create: {
                healthCardNumber: p.insurance.healthCardNumber,
                expiryDate: p.insurance.expiryDate
                  ? new Date(`${p.insurance.expiryDate}T00:00:00.000Z`)
                  : null,
                preferredDoctor: p.insurance.preferredDoctor,
              },
            }
          : undefined,
        additionalInfo: (p as { additional?: { guardian?: string } }).additional
          ? {
              create: {
                guardian: (p as { additional: { guardian: string } }).additional
                  .guardian,
              },
            }
          : undefined,
      },
    });
    created++;
  }

  console.log(
    `Seeded ${created} patients (${patients.length - created} already existed).`,
  );
}

async function main() {
  await seedRoles();
  await seedAdmin();
  await seedOptometrist();
  await seedBranches();
  await seedPatients();

  console.log("Database seed completed successfully.");
  console.log(`Admin login: ${ADMIN_EMAIL}`);
  console.log(`Optometrist login: ${OPTOMETRIST_EMAIL}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
