# Stacks — Library Management System

A JavaScript MERN application with a React/Vite frontend, Express REST API, and MongoDB/Mongoose persistence. It includes JWT authentication, backend role checks, catalogue and category management, inventory copies, loans/returns/renewals, reservations, fine assessment, in-app notifications, settings, reports, and audit records.

## Requirements
- Node.js 20.19+ or 22.12+ recommended (Vite 7 requirement)
- npm 10+
- MongoDB 7+ local deployment or MongoDB Atlas URI

## Setup
1. Install and start MongoDB (or create an Atlas database).
2. In `backend/`, copy `.env.example` to `.env`; set `MONGODB_URI`, a unique `JWT_SECRET` (at least 32 characters), and a strong `ADMIN_PASSWORD`. Never commit `.env`.
3. In `frontend/`, copy `.env.example` to `.env` if the API is not at `http://localhost:5000/api/v1`.
4. From the root run `npm run install:all`.
5. Create the initial administrator: `npm run seed:admin --prefix backend`.
6. Start the API in one terminal: `npm run dev:backend`. Start the UI in another: `npm run dev:frontend`. Open the Vite URL printed in the terminal.

## Commands
- `npm run dev:backend` — API with nodemon
- `npm run dev:frontend` — Vite development server
- `npm run build --prefix frontend` — production frontend build
- `npm test --prefix backend` — Node test runner / Supertest smoke tests
- `npm test --prefix frontend` — Vitest / React Testing Library

## First use
Register a member at the API (`POST /api/v1/auth/register`) or through a future public registration page, sign in, then use an administrator/librarian account to create categories and book metadata. Create physical copies at Inventory using the book's MongoDB ObjectId. Issue a copy through `POST /api/v1/loans/issue` with `{ "copyId": "...", "memberId": "..." }`. Members can reserve a title via `POST /api/v1/reservations` with `{ "bookId": "..." }`.

## Roles
- `admin`: settings, user/role management, audit logs, staff functions
- `librarian`: catalogue/inventory, member assistance, issue/return, reports
- `member`: own loans, reservations, fines and notifications; catalogue browsing

Public registration hardcodes `member`; administrator provisioning is via the seed script. The frontend uses sessionStorage for a bearer token and clears it on logout. For a public production deployment, consider migrating to secure HttpOnly cookies with CSRF protections and a refresh-token strategy.

## API overview
Base path `/api/v1`. JSON responses use `{ success, data, meta? }`; errors use `{ success:false, message, details? }`. Main endpoints: `/auth`, `/books`, `/categories`, `/authors`, `/users`, `/inventory/copies`, `/loans`, `/reservations`, `/fines`, `/notifications`, `/reports`, `/settings`, `/audit-logs`, `/dashboard`. See `docs/api-documentation.md`.

## Important implementation notes
- The API is designed for real MongoDB persistence; it does not substitute localStorage or mock APIs for database storage.
- Issue uses an atomic `findOneAndUpdate` on an available copy to prevent double issue of one copy. If creating the loan fails, it attempts to restore copy availability. A multi-document transaction is preferable for a replica set deployment; the fallback compensation is not equivalent to an atomic transaction if the process terminates mid-workflow.
- Reservation queue numbers are simple counts, not a fully serialized queue allocator; simultaneous reservation creation can race. Reservation expiry/automatic fulfilment jobs and email delivery are not implemented.
- Fine payment recording is not a payment-provider integration. The current fine model supports status/reference fields, but payment/waiver workflows should be implemented before real financial operations.
- Password reset and email delivery are not implemented because no mail provider configuration was supplied.
- No production deployment configuration is included. Run a security review, install audit, full workflow tests against an isolated replica-set test database, and browser-based responsive checks before production use.

## Validation report
See `docs/testing-report.md`. Do not interpret a successful frontend build or health smoke test as proof that every module and end-to-end scenario has been validated.
