# 🏥 Retail & Optical Clinic Management System

A full-stack **Retail & Optical Clinic Management** system built with **React + TypeScript** frontend and **Express.js + Prisma** backend, following a clean **Controller → Service** architecture.

Manage patient registrations, clinic branches, and user roles with JWT authentication, feature-key based RBAC (Role-Based Access Control), soft deletes, duplicate detection, and an interactive dark-themed UI.

---

## 🛠️ Tech Stack

### Frontend

| Technology                | Purpose                               |
| ------------------------- | ------------------------------------- |
| **React 19** + TypeScript | UI framework with type safety         |
| **Vite 6**                | Build tool & dev server               |
| **Material UI (MUI) v6**  | Component library & theming           |
| **MUI X DataGrid**        | Advanced data tables with sorting     |
| **MUI X Date Pickers**    | Date inputs with Day.js adapter       |
| **Redux + Redux-Saga**    | State management & async side effects |
| **React Hook Form**       | Form handling & validation            |
| **React Router v7**       | Client-side routing                   |
| **Recharts**              | Data visualization (charts)           |
| **Axios**                 | HTTP client with JWT interceptors     |
| **SCSS Modules**          | Scoped custom styling                 |
| **Day.js**                | Date manipulation                     |
| **ESLint + Prettier**     | Code quality & formatting             |

### Backend

| Technology                  | Purpose                             |
| --------------------------- | ----------------------------------- |
| **Express.js**              | Node.js web framework               |
| **TypeScript** + ES Modules | Type safety & modern JS             |
| **Prisma v7**               | ORM with PostgreSQL adapter         |
| **PostgreSQL**              | Relational database                 |
| **Zod**                     | Request validation & type inference |
| **JSON Web Token (JWT)**    | Authentication                      |
| **bcryptjs**                | Password hashing                    |
| **Pino**                    | Structured logging                  |
| **Swagger (OpenAPI 3.0)**   | Interactive API documentation       |
| **ESLint + Prettier**       | Code quality & formatting           |

---

## ✨ Key Features

### 🔐 Authentication & Security

- User login with JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Account lockout after 5 failed login attempts (configurable)
- Protected routes with auto-redirect on missing/expired token
- Login attempt tracking (IP, user agent, timestamp)

### 👥 Role-Based Access Control (RBAC)

- **Three roles**: Admin, Cashier, Optometrist
- Feature-key based permission matrix (`PERMISSION_MAP`) — single source of truth
- `<Authorize>` declarative component for UI-level access guards
- `usePermission` / `usePermissions` hooks for imperative checks
- Sidebar navigation filtered by role
- Backend `authorize()` middleware mirrors frontend permissions exactly

| Feature            | Admin | Cashier | Optometrist |
| ------------------ | ----- | ------- | ----------- |
| Create Patient     | ✅    | ❌      | ❌          |
| Update Patient     | ✅    | ✅      | ✅          |
| Delete Patient     | ✅    | ❌      | ❌          |
| Restore Patient    | ✅    | ✅      | ❌          |
| View Patients      | ✅    | ✅      | ✅          |
| Manage Branches    | ✅    | Partial | ❌          |
| Manage Roles       | ✅    | ❌      | ❌          |
| Dashboard          | ✅    | ✅      | ✅          |
| Appointments / EMR | ✅    | ❌      | ✅          |
| Billing            | ✅    | ✅      | ❌          |
| Reports            | ✅    | ✅      | ✅          |

### 🧑‍⚕️ Patient Registration (CRUD)

- Create, read, update, and soft-delete patient records
- Auto-generated patient code (`PT-YYMMDD-XXX`)
- Searchable & filterable patient list with DataGrid
- Filters: first name, last name, age range, gender, doctor, health card, status
- Patient profile side-panel with quick info, visit history, and status toggle
- Duplicate detection warning (same Full Name + DOB at same branch)
- Soft delete with mandatory reason & restore capability
- Emergency contact copy from patient address

### 🏢 Branch Management

- CRUD for clinic branches with unique branch codes
- Delete protection (branches with linked patients cannot be deleted)
- frontend ready for expansion

### 📊 Dashboard

- Summary cards and data visualizations (placeholder — ready for expansion)

### 📋 Reports

- Filterable reports module (placeholder — ready for expansion)

---

## 📁 Project Structure

```
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── assets/                    # Theme (MUI + SCSS), images (login-bg.svg)
│   │   ├── components/
│   │   │   ├── patients/              # PatientTable, PatientProfile, PatientEntryForm,
│   │   │   │                          #   PatientUpdateForm, PatientFilters,
│   │   │   │                          #   DeleteConfirmDialog, DuplicateWarningDialog
│   │   │   └── shared/                # PageHeader, Authorize, AlertSnackbar
│   │   ├── pages/                     # AuthPage, Patients, Dashboard, Profile
│   │   ├── redux/                     # Actions, Reducers, Sagas
│   │   ├── routes/                    # Route definitions & PrivateRoute guard
│   │   ├── services/                  # Axios API service layer
│   │   ├── templates/                 # AppLayout with sidebar & header
│   │   ├── types/                     # Global TypeScript declarations
│   │   └── utilities/
│   │       ├── constants/             # App, route, action, patient, permissions config
│   │       ├── helpers/               # Form validator, patient helpers
│   │       ├── hooks/                 # usePermission, usePermissions
│   │       └── models/                # TypeScript interfaces & DTOs
│   └── ...
│
├── backend/                           # Express Backend
│   ├── prisma/
│   │   └── schema.prisma             # Database schema (10 models, 2 enums)
│   ├── src/
│   │   ├── config/                   # DB, Logger, Swagger config
│   │   ├── middleware/               # Auth, Authorize, Error handler, Zod validation
│   │   ├── modules/
│   │   │   ├── auth/                 # Login, profile, logout
│   │   │   ├── patients/             # Full CRUD with soft delete & restore
│   │   │   ├── branches/             # Branch management
│   │   │   └── roles/                # Role management
│   │   ├── shared/                   # Constants, response & export helpers
│   │   ├── routes/                   # Route aggregator
│   │   └── server.ts                 # App entry point
│   └── ...
│
├── database/
│   ├── prisma/
│   │   └── schema.prisma             # Prisma schema source
│   └── seed.ts                       # Database seeding (roles, users, branches, patients)
│
└── README.md
```

---

## 🗄️ Database Schema

### Models

| Model                       | Description                              | Key Relationships                           |
| --------------------------- | ---------------------------------------- | ------------------------------------------- |
| **Role**                    | User roles (ADMIN, CASHIER, OPTOMETRIST) | One-to-many → User                          |
| **User**                    | System users with hashed passwords       | Many-to-one → Role                          |
| **Branch**                  | Clinic branches with unique codes        | One-to-many → Patient                       |
| **Patient**                 | Core patient record with soft delete     | → Branch, → User (deletedBy)                |
| **PatientAddress**          | Patient address (1:1)                    | → Patient                                   |
| **PatientPhoneNumber**      | Phone numbers by type (1:many)           | → Patient (unique on patientId + phoneType) |
| **PatientEmergencyContact** | Emergency contact details (1:1)          | → Patient                                   |
| **PatientInsuranceInfo**    | Health card & insurance (1:1)            | → Patient                                   |
| **PatientAdditionalInfo**   | Guardian, referral, notes (1:1)          | → Patient                                   |
| **AuthLoginAttempt**        | Login attempt audit trail                | → User (optional)                           |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **PostgreSQL** 14+ (running locally or remote)
- **npm** or **yarn**

### 1. Clone the repository

```bash
git clone <repository-url>
cd Retail_-_Optical_Clinic_Management_System-React_Node_Express_Postgre
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/optical_clinic_db
JWT_SECRET=your-secret-key
```

Create the database (in psql or pgAdmin):

```sql
CREATE DATABASE optical_clinic_db;
```

Run migrations, seed, and start the server:

```bash
npx prisma migrate dev --name init
npm run seed          # Seeds roles, admin, optometrist, branches, 20 patients
npm run dev           # Server runs on http://localhost:5000
```

Swagger API docs available at: `http://localhost:5000/api-docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev           # App runs on http://localhost:5173
```

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

### 🔑 Seeded Users

| Role        | Email                      | Password      |
| ----------- | -------------------------- | ------------- |
| Admin       | `admin@clinic.local`       | `Admin@12345` |
| Optometrist | `optometrist@clinic.local` | `Opto@12345`  |

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command                   | Description                            |
| ------------------------- | -------------------------------------- |
| `npm run dev`             | Start dev server with hot reload (tsx) |
| `npm run build`           | Compile TypeScript to `dist/`          |
| `npm start`               | Run production build                   |
| `npm run seed`            | Seed database with demo data           |
| `npm run lint`            | Run ESLint                             |
| `npm run lint:fix`        | Run ESLint with auto-fix               |
| `npm run format`          | Format code with Prettier              |
| `npm run format:check`    | Check formatting without writing       |
| `npm run prisma:migrate`  | Run database migrations                |
| `npm run prisma:generate` | Generate Prisma client                 |
| `npm run prisma:studio`   | Open Prisma Studio (DB GUI)            |

### Frontend (`/frontend`)

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start Vite dev server     |
| `npm run build`    | Build for production      |
| `npm run preview`  | Preview production build  |
| `npm run lint`     | Run ESLint                |
| `npm run lint:fix` | Run ESLint with auto-fix  |
| `npm run format`   | Format code with Prettier |

---

## 🔗 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint        | Description           | Auth      |
| ------ | --------------- | --------------------- | --------- |
| POST   | `/auth/login`   | Login & get JWT token | ❌ Public |
| GET    | `/auth/profile` | Get user profile      | ✅        |
| POST   | `/auth/logout`  | Logout                | ✅        |

### Patients

| Method | Endpoint                | Description                   | Access                      |
| ------ | ----------------------- | ----------------------------- | --------------------------- |
| POST   | `/patients`             | Register new patient          | ADMIN                       |
| GET    | `/patients`             | List patients (search/filter) | All authenticated           |
| GET    | `/patients/:id`         | Get patient by ID             | All authenticated           |
| PATCH  | `/patients/:id`         | Update patient                | ADMIN, CASHIER, OPTOMETRIST |
| DELETE | `/patients/:id`         | Soft delete patient           | ADMIN                       |
| POST   | `/patients/:id/restore` | Restore deleted patient       | ADMIN, CASHIER              |

### Branches

| Method | Endpoint        | Description      | Access         |
| ------ | --------------- | ---------------- | -------------- |
| POST   | `/branches`     | Create branch    | ADMIN          |
| GET    | `/branches`     | List branches    | ADMIN, CASHIER |
| GET    | `/branches/:id` | Get branch by ID | ADMIN, CASHIER |
| PATCH  | `/branches/:id` | Update branch    | ADMIN, CASHIER |
| DELETE | `/branches/:id` | Delete branch    | ADMIN          |

### Roles

| Method | Endpoint     | Description    | Access |
| ------ | ------------ | -------------- | ------ |
| POST   | `/roles`     | Create role    | ADMIN  |
| GET    | `/roles`     | List roles     | ADMIN  |
| GET    | `/roles/:id` | Get role by ID | ADMIN  |
| PATCH  | `/roles/:id` | Update role    | ADMIN  |
| DELETE | `/roles/:id` | Delete role    | ADMIN  |

> **Interactive API Docs:** Visit `http://localhost:5000/api-docs` for Swagger UI.

---

## 🌱 Environment Variables

### Backend (`backend/.env`)

| Variable                      | Description                         | Default                 |
| ----------------------------- | ----------------------------------- | ----------------------- |
| `PORT`                        | Server port                         | `5000`                  |
| `NODE_ENV`                    | Environment                         | `development`           |
| `DATABASE_URL`                | PostgreSQL connection string        | —                       |
| `JWT_SECRET`                  | JWT signing secret                  | —                       |
| `JWT_EXPIRES_IN`              | Token expiry                        | `7d`                    |
| `AUTH_MAX_FAILED_ATTEMPTS`    | Max login failures before lockout   | `5`                     |
| `AUTH_ATTEMPT_WINDOW_MINUTES` | Window for counting failed attempts | `15`                    |
| `AUTH_LOCKOUT_MINUTES`        | Account lockout duration            | `15`                    |
| `CORS_ORIGIN`                 | Allowed CORS origin                 | `http://localhost:5173` |
| `LOG_LEVEL`                   | Pino log level                      | `info`                  |

### Frontend

> No `.env` file required — Vite proxy handles API requests automatically via `vite.config.ts`.
> fields.
> • Store audit-friendly timestamps such as created_at and updated_at on core tables.
> • The API should return clean validation errors and proper HTTP status codes.
> • Sensitive values such as passwords must be hashed using a secure algorithm such as bcrypt

Suggested minimum schema
Table-Purpose
users - Application users and hashed credentials
roles - Admin / Cashier / Optometrist role definitions
branches - Clinic/branch master data
patients - Patient master record including status and registration
metadata
patient_contacts - Patient and emergency contact details
auth_login_attempts - Optional failed-login tracking for lockout
