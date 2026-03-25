-- Normalize patient registration details into dedicated tables.

-- New enum for normalized phone collection
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PhoneType') THEN
    CREATE TYPE "PhoneType" AS ENUM ('MOBILE', 'BUSINESS', 'ADDITIONAL');
  END IF;
END $$;

-- Address table (1:1 with patient)
CREATE TABLE IF NOT EXISTS "patient_addresses" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "address_line1" VARCHAR(255) NOT NULL,
  "address_line2" VARCHAR(255),
  "city" VARCHAR(120),
  "province" VARCHAR(120),
  "postal_code" VARCHAR(20),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_addresses_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_addresses_patient_id_key" UNIQUE ("patient_id")
);

-- Phone table (1:N with one required primary phone)
CREATE TABLE IF NOT EXISTS "patient_phone_numbers" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "phone_type" "PhoneType" NOT NULL,
  "phone_number" VARCHAR(20) NOT NULL,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_phone_numbers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_phone_numbers_patient_id_phone_type_key" UNIQUE ("patient_id", "phone_type"),
  CONSTRAINT "patient_phone_numbers_phone_number_digits_chk" CHECK ("phone_number" ~ '^[0-9]{10}$')
);

-- Emergency contact table (1:1 with patient)
CREATE TABLE IF NOT EXISTS "patient_emergency_contacts" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "full_name" VARCHAR(150) NOT NULL,
  "relationship" VARCHAR(100),
  "contact_number" VARCHAR(20) NOT NULL,
  "address_line1" VARCHAR(255),
  "address_line2" VARCHAR(255),
  "city" VARCHAR(120),
  "province" VARCHAR(120),
  "postal_code" VARCHAR(20),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_emergency_contacts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_emergency_contacts_patient_id_key" UNIQUE ("patient_id"),
  CONSTRAINT "patient_emergency_contacts_contact_number_digits_chk" CHECK ("contact_number" ~ '^[0-9]{10}$')
);

-- Insurance extension table (1:1 with patient)
CREATE TABLE IF NOT EXISTS "patient_insurance_info" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "health_card_number" VARCHAR(60),
  "health_card_vision_code" VARCHAR(20),
  "expiry_date" DATE,
  "preferred_doctor" VARCHAR(150),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_insurance_info_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_insurance_info_patient_id_key" UNIQUE ("patient_id")
);

-- Additional info extension table (1:1 with patient)
CREATE TABLE IF NOT EXISTS "patient_additional_info" (
  "id" SERIAL NOT NULL,
  "patient_id" INTEGER NOT NULL,
  "guardian" VARCHAR(150),
  "referred_by" VARCHAR(150),
  "patient_note" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patient_additional_info_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_additional_info_patient_id_key" UNIQUE ("patient_id")
);

-- New indexes
CREATE INDEX IF NOT EXISTS "patient_addresses_city_idx" ON "patient_addresses" ("city");
CREATE INDEX IF NOT EXISTS "patient_addresses_province_idx" ON "patient_addresses" ("province");
CREATE INDEX IF NOT EXISTS "patient_phone_numbers_patient_id_idx" ON "patient_phone_numbers" ("patient_id");
CREATE INDEX IF NOT EXISTS "patient_phone_numbers_phone_number_idx" ON "patient_phone_numbers" ("phone_number");
CREATE INDEX IF NOT EXISTS "patient_phone_numbers_is_primary_phone_number_idx" ON "patient_phone_numbers" ("is_primary", "phone_number");
CREATE INDEX IF NOT EXISTS "patient_emergency_contacts_contact_number_idx" ON "patient_emergency_contacts" ("contact_number");
CREATE INDEX IF NOT EXISTS "patient_insurance_info_health_card_number_idx" ON "patient_insurance_info" ("health_card_number");

-- FK constraints
ALTER TABLE "patient_addresses"
  ADD CONSTRAINT "patient_addresses_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "patient_phone_numbers"
  ADD CONSTRAINT "patient_phone_numbers_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "patient_emergency_contacts"
  ADD CONSTRAINT "patient_emergency_contacts_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "patient_insurance_info"
  ADD CONSTRAINT "patient_insurance_info_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "patient_additional_info"
  ADD CONSTRAINT "patient_additional_info_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing address data
INSERT INTO "patient_addresses" ("patient_id", "address_line1")
SELECT "id", trim("address")
FROM "patients"
WHERE "address" IS NOT NULL AND length(trim("address")) > 0
ON CONFLICT ("patient_id") DO NOTHING;

-- Backfill existing primary phone from patients.contact_number
INSERT INTO "patient_phone_numbers" ("patient_id", "phone_type", "phone_number", "is_primary")
SELECT "id", 'MOBILE'::"PhoneType", "contact_number", true
FROM "patients"
WHERE "contact_number" IS NOT NULL AND length(trim("contact_number")) > 0
ON CONFLICT ("patient_id", "phone_type") DO NOTHING;

-- Backfill one emergency contact from previous patient_contacts data
INSERT INTO "patient_emergency_contacts" (
  "patient_id", "full_name", "relationship", "contact_number"
)
SELECT DISTINCT ON (pc."patient_id")
  pc."patient_id",
  pc."name",
  pc."relationship",
  pc."contact_number"
FROM "patient_contacts" pc
WHERE pc."type" IN ('EMERGENCY', 'GUARDIAN', 'OTHER')
ORDER BY pc."patient_id", pc."is_primary" DESC, pc."id" ASC
ON CONFLICT ("patient_id") DO NOTHING;

-- Drop old patient_contacts relation/indexes and enum
DROP TABLE IF EXISTS "patient_contacts";
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContactType') THEN
    DROP TYPE "ContactType";
  END IF;
END $$;

-- Remove strict unique identity index to allow controlled admin override duplicates.
DROP INDEX IF EXISTS "patients_full_name_date_of_birth_branch_id_active_key";

-- Remove old single-address/single-phone columns from patients
DROP INDEX IF EXISTS "patients_contact_number_idx";
ALTER TABLE "patients" DROP COLUMN IF EXISTS "contact_number";
ALTER TABLE "patients" DROP COLUMN IF EXISTS "address";

-- Keep email column on patients for backward compatibility.
