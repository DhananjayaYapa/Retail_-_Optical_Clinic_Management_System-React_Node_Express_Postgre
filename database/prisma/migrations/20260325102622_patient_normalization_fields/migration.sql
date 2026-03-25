/*
  Warnings:

  - You are about to drop the column `email` on the `patients` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "patients_active_only_idx";

-- DropIndex
DROP INDEX "patients_email_idx";

-- DropIndex
DROP INDEX "patients_full_name_trgm_idx";

-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_additional_info" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_addresses" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_emergency_contacts" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_insurance_info" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patient_phone_numbers" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "email",
ALTER COLUMN "registration_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;
