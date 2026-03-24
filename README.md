# Retail Optical Clinic Management Application

A Full-stack Retail & Optical Clinic Management system built with monolith architecture using React + Redux + TypeScript on the frontend and Express.js + Prisma on the backend, following a clean Controller -> Service architecture with JWT authentication, role-based access, patient CRUD, soft delete, and smart emergency contact copy feature. Designed for clean, scalable full-stack development.

Task 1 Authentication - Login and
logout flow
Validation, session/JWT
handling, secure backend
design

* Authentication
• Build a login screen using the supplied design direction.
• Validate username and password fields and show inline error feedback.
• Authenticate against the backend and redirect to the Patient Details page on success.
• Implement logout that clears the session/token correctly.
Bonus considerations: role-based access (Admin, Cashier, Optometrist), lockout after five failed attempts, and
protection of private routes.



Task 2 Patient Registration CRUD
module
API design, relational
schema, filtering,
pagination, soft delete

 Patient Registration CRUD
Build a patient registration module with create, read, update, and soft-delete functionality. The patient list should
support search, filters, and pagination.

Patient ID - Auto-generated Read-only, system generated
Full Name - Text Required, minimum 3 characters
Date of Birth - Date picker Required, must be a past date
Gender - Dropdown Male / Female / Other
Contact Number - Text Required, numeric, 10 digits
Email Address - Text Optional, valid email format
Address - Textarea Optional
Branch - Dropdown Required - list of clinic branches
Registration Date - Auto-set Read-only, defaults to today

CRUD behavior: create, searchable/filterable read view, update with confirmation before save, and soft delete with
mandatory reason.
Bonus consideration: warn on possible duplicate patient at the same branch when Full Name + Date of Birth
already exist.


task- Database and API Expectations
• Use a normalized schema with separate tables for users, roles, branches, patients, and patient_contacts or
equivalent.
• Soft deletes must be represented in the schema, for example with deleted_at, deleted_by, and delete_reason
fields.
• Store audit-friendly timestamps such as created_at and updated_at on core tables.
• The API should return clean validation errors and proper HTTP status codes.
• Sensitive values such as passwords must be hashed using a secure algorithm such as bcrypt

Suggested minimum schema
Table-Purpose
users - Application users and hashed credentials
roles - Admin / Cashier / Optometrist role definitions
branches - Clinic/branch master data
patients - Patient master record including status and registration
metadata
patient_contacts - Patient and emergency contact details
auth_login_attempts - Optional failed-login tracking for lockout
