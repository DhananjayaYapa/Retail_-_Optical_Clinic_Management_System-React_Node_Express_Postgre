import "../backend/node_modules/dotenv/config.js";
// @ts-expect-error Root-level seed references backend-local dependency tree.
import bcrypt from "../backend/node_modules/bcryptjs/index.js";
import prisma from "../backend/src/config/db.js";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@clinic.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
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

async function main() {
  await seedRoles();
  await seedAdmin();
  await seedBranches();

  console.log("Database seed completed successfully.");
  console.log(`Admin login: ${ADMIN_EMAIL}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
