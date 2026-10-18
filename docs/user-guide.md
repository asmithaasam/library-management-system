# User guide

## Administrator
1. Copy `backend/.env.example` to `backend/.env` and set a long random `JWT_SECRET`, MongoDB URI, and strong admin password.
2. Run `npm run seed:admin --prefix backend` once.
3. Sign in, add categories and books, register physical copies, and manage users/settings.
4. Review audit records and reports regularly.

## Librarian
- Add catalogue metadata and physical copies.
- Issue a copy using the API with its copy ID and member ID.
- Process returns promptly so availability and any applicable overdue fine are updated.
- Review reservations, overdue loans and reports.

## Member
- Register with name/email/password and sign in.
- Browse the catalogue and reserve a title.
- Review loans, reservations, fines and notifications in the workspace.

## Troubleshooting
- `MONGODB_URI is required`: configure backend `.env`.
- Invalid/expired token: sign in again.
- CORS error: align `CLIENT_ORIGIN` with the actual Vite origin.
- Can't create admin via registration: intentional; use the secure seed script.
