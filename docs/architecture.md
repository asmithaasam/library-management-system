# Architecture

## Layers
- **React/Vite** renders role-filtered navigation and data-driven screens. `services/api.js` centralizes API calls and bearer-token attachment. `AuthContext` owns the current session.
- **Express** mounts versioned routes, request body limits, Helmet, allowlisted CORS, authentication rate limiting, centralized 404/error responses, and controller handlers.
- **Mongoose/MongoDB** persists users, books, authors, categories, physical copies, loans, reservations, fines, notifications, library settings, and audit logs.

## Trust boundaries
All access control must be enforced in Express middleware and controllers. Client-side navigation filtering is only a usability feature. Passwords are bcrypt-hashed (cost 12) and excluded from ordinary user query/JSON output. Public registration always creates a member. Admin provisioning uses an environment-backed one-time seed script.

## Core workflows
1. Staff creates book metadata and individual accession-number copies.
2. Staff issues a specific available copy to an active member under the configured loan limit. The copy's available state is atomically claimed before the loan is inserted; failure attempts a compensating release.
3. Staff returns an active loan; the copy becomes available and an overdue fine may be assessed.
4. Members reserve titles and may cancel their own active reservation.
5. Notifications are persisted in MongoDB and users can mark their own notifications read.

## Consistency caveat
Multi-document workflows are not wrapped in MongoDB sessions in this initial build. Atomic conditional updates protect the most important single-copy race, but crashes between related writes can still require reconciliation. For robust deployment, configure MongoDB as a replica set, add session-aware transaction services for issue/return/fine/reservation workflows, and test failure injection.

## Documentation consulted during planning
- React reference: https://react.dev/reference/react
- MongoDB Node/React MERN overview: https://www.mongodb.com/docs/drivers/node-frameworks/react/
- Mongoose connection guidance: https://mongoosejs.com/docs/connections.html
- Mongoose transaction guidance: https://mongoosejs.com/docs/8.x/docs/transactions.html
- Express production security guidance: https://expressjs.com/en/advanced/best-practice-security.html

These are design references, not a claim that every requirement has passed automated verification.
