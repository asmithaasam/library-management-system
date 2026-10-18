# API reference

Base: `/api/v1`; JSON body; bearer JWT in `Authorization: Bearer <token>` for protected endpoints. Success: `{ "success": true, "data": ..., "meta"?: ... }`. Error: `{ "success": false, "message": "...", "details"?: [...] }`.

## Auth
- `POST /auth/register` `{name,email,password}` — public member registration; password 10–128 chars.
- `POST /auth/login` `{email,password}` — returns user and access token.
- `GET /auth/me` — current account.
- `POST /auth/logout` — stateless acknowledgement; client must discard the token.

## Catalogue and accounts
- `GET /books?q=&category=&available=&page=&limit=` — authenticated catalogue.
- `GET /books/:id` — book details and physical copies.
- `POST /books`, `PATCH /books/:id` — admin/librarian.
- `GET/POST/PATCH /categories` and `/authors` — staff; create/update validation.
- `GET/POST/PATCH /users` — admin only for management endpoints. `PATCH /users/:id/status` updates account status. Public registration cannot set roles.

## Inventory and loans
- `GET /inventory/copies`, `POST /inventory/copies` `{bookId,accessionNumber}` — staff.
- `GET /loans` — staff; members should use `GET /my/loans` (only their own records).
- `POST /loans/issue` `{copyId,memberId}` — staff.
- `POST /loans/:id/return` — staff; processes return and assesses late fine.
- `POST /loans/:id/renew` — staff or owner member, subject to policy and reservation checks.

## Reader services
- `GET /my/summary`, `GET /my/loans`, `GET /my/reservations` — current member scope.
- `POST /reservations` `{bookId}` and `DELETE /reservations/:id` — member's own reservations.
- `GET /reservations` — staff queue.
- `GET /fines` — own fines for members; staff view all.
- `GET /notifications`, `PATCH /notifications/:id/read` — current user's notifications.

## Administration and reports
- `GET /dashboard` — live aggregates.
- `GET /reports` — loans by status, most-borrowed books, category counts and fine summary (staff).
- `GET/PATCH /settings` — read settings for authenticated users; patch is admin-only.
- `GET /audit-logs` — admin-only.
- `GET /health` — basic API health; does not by itself guarantee database readiness.

List endpoints are limited to 100 records per request by the pagination helper where pagination is wired; some operational views intentionally cap results at 200–500. CSV export, full date-range report filters, password reset and online payment endpoints are not implemented.
