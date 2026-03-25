-- Create enums
CREATE TYPE "PatientGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE "ContactType" AS ENUM ('SELF', 'EMERGENCY', 'GUARDIAN', 'OTHER');

-- Case-insensitive email support
CREATE EXTENSION IF NOT EXISTS citext;

-- Create tables
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" CITEXT NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "patient_code" VARCHAR(40) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "PatientGender" NOT NULL,
    "contact_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "address" TEXT,
    "branch_id" INTEGER NOT NULL,
    "registration_date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,
    "delete_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "patients_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "patients_date_of_birth_past_chk" CHECK ("date_of_birth" < CURRENT_DATE),
    CONSTRAINT "patients_contact_number_digits_chk" CHECK ("contact_number" ~ '^[0-9]{10}$'),
    CONSTRAINT "patients_delete_reason_required_chk" CHECK (
        ("deleted_at" IS NULL AND "deleted_by" IS NULL AND "delete_reason" IS NULL)
        OR
        ("deleted_at" IS NOT NULL AND "deleted_by" IS NOT NULL AND length(trim("delete_reason")) > 0)
    )
);

CREATE TABLE "patient_contacts" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "type" "ContactType" NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "relationship" VARCHAR(100),
    "contact_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "patient_contacts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "patient_contacts_contact_number_digits_chk" CHECK ("contact_number" ~ '^[0-9]{10}$')
);

CREATE TABLE "auth_login_attempts" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER,
    "email" VARCHAR(255) NOT NULL,
    "ip_address" VARCHAR(64),
    "user_agent" VARCHAR(512),
    "is_success" BOOLEAN NOT NULL DEFAULT false,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auth_login_attempts_pkey" PRIMARY KEY ("id")
);

-- Uniqueness constraints
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");
CREATE UNIQUE INDEX "patients_patient_code_key" ON "patients"("patient_code");
CREATE UNIQUE INDEX "patients_full_name_date_of_birth_branch_id_active_key" ON "patients"("full_name", "date_of_birth", "branch_id") WHERE "deleted_at" IS NULL;

-- Query-performance indexes
CREATE INDEX "users_role_id_idx" ON "users"("role_id");
CREATE INDEX "branches_name_idx" ON "branches"("name");

CREATE INDEX "patients_branch_id_deleted_at_idx" ON "patients"("branch_id", "deleted_at");
CREATE INDEX "patients_branch_id_deleted_at_registration_date_idx" ON "patients"("branch_id", "deleted_at", "registration_date");
CREATE INDEX "patients_contact_number_idx" ON "patients"("contact_number");
CREATE INDEX "patients_email_idx" ON "patients"("email");
CREATE INDEX "patients_full_name_idx" ON "patients"("full_name");
CREATE INDEX "patients_date_of_birth_idx" ON "patients"("date_of_birth");
CREATE INDEX "patients_active_only_idx" ON "patients"("branch_id", "registration_date") WHERE "deleted_at" IS NULL;

CREATE INDEX "patient_contacts_patient_id_idx" ON "patient_contacts"("patient_id");
CREATE INDEX "patient_contacts_contact_number_idx" ON "patient_contacts"("contact_number");
CREATE INDEX "patient_contacts_type_idx" ON "patient_contacts"("type");

CREATE INDEX "auth_login_attempts_email_is_success_attempted_at_desc_idx" ON "auth_login_attempts"("email", "is_success", "attempted_at" DESC);
CREATE INDEX "auth_login_attempts_user_id_attempted_at_idx" ON "auth_login_attempts"("user_id", "attempted_at");
CREATE INDEX "auth_login_attempts_is_success_attempted_at_idx" ON "auth_login_attempts"("is_success", "attempted_at");

-- Optional fuzzy search optimization for patient name lookups
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "patients_full_name_trgm_idx" ON "patients" USING GIN ("full_name" gin_trgm_ops);

-- Foreign keys
ALTER TABLE "users"
    ADD CONSTRAINT "users_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "roles"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "patients"
    ADD CONSTRAINT "patients_branch_id_fkey"
    FOREIGN KEY ("branch_id") REFERENCES "branches"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "patients"
    ADD CONSTRAINT "patients_deleted_by_fkey"
    FOREIGN KEY ("deleted_by") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "patient_contacts"
    ADD CONSTRAINT "patient_contacts_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "patients"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "auth_login_attempts"
    ADD CONSTRAINT "auth_login_attempts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
