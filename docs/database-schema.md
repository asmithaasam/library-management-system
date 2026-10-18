# Database schema

All models use Mongoose timestamps.

- **User**: name, unique normalized email, bcrypt password hash, role, status, member code, phone.
- **Book**: title, sparse unique ISBN, author references/names, publisher, edition, language, publication year, category reference, description, cover URL, shelf, tags, active/archive status, total copy count. Text index supports title/author/ISBN/tag discovery.
- **Author / Category**: named records with active flags; category names are unique.
- **BookCopy**: book reference, unique accession number, status (`available`, `issued`, `reserved`, `damaged`, `lost`), condition and notes.
- **Loan**: copy/book/member/staff references, issue/due/return dates, status, renewal count/history. Indexed by copy and status.
- **Reservation**: book/member references, status, queue number, expiry/notification timestamps.
- **Fine**: loan/member references, amount, status, payment reference, assessment/resolution timestamps.
- **Notification**: user, title/message/type, read timestamp and optional link.
- **LibrarySettings**: singleton key plus loan duration, limits, fine rules and reservation expiry.
- **AuditLog**: actor, action, resource type/id, metadata, IP and timestamp. Avoid sensitive values in metadata.

Data integrity depends on unique indexes and controller workflows. Category deletion/archive endpoints and author update/archive UI are not fully implemented; avoid direct deletion of referenced records.
