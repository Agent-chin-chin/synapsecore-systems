# SynapseCore API Documentation

## Authentication

### POST /api/auth/login
- Description: Authenticate user and set an httpOnly session cookie.
- Request body:
  - `email` (string)
  - `password` (string)
- Response:
  - `message`: string
  - `data`: authenticated user object

### POST /api/auth/register
- Description: Register a new user and return an authentication token.
- Request body:
  - `fullname` (string)
  - `email` (string)
  - `phone` (string)
  - `password` (string)
  - `role` (string, optional)
- Response:
  - `message`: string
  - `data`: created user object

## Incidents

### GET /api/incidents
- Description: Fetch incident listings with optional filters.
- Query parameters:
  - `status`
  - `incidentType`
  - `priority`
  - `severity`
  - `assignedTo`
  - `assignedToName`
  - `search`
  - `page`
  - `limit`
- Response:
  - `message`: string
  - `data`: pagination result containing incidents and metadata

### POST /api/incidents
- Description: Create a new incident report.
- Request body:
  - `incidentType` (string)
  - `description` (string)
  - `priority` (string)
  - `severity` (string)
  - `attachments` (array of strings)
- Response:
  - `message`: string
  - `data`: created incident object

## Uploads

### POST /api/upload
- Description: Upload attachment files securely to the configured storage backend.
- Request body: multipart/form-data
  - `file` (file)
- Response:
  - `message`: string
  - `fileUrl`: uploaded file URL
  - `fileName`: original file name
  - `fileSize`: file size in bytes
  - `fileType`: MIME type
  - `metadata`: file metadata for auditing

## Booking

### POST /api/booking
- Description: Submit booking requests for security services.
- Request body:
  - `userId` (string)
  - `serviceType` (string)
  - `description` (string)
  - `priority` (string)
  - `attachments` (array of strings)
- Response:
  - `message`: string
  - `data`: booking object

## Error Responses

All APIs use a structured response format with the following fields:
- `message`: user-facing status message
- `status`: HTTP status code
- `error`: optional detail or validation errors

## Notes

- API routes require authentication via the `token` cookie for protected operations.
- File uploads are validated for type and size before being accepted.
- Production email delivery is configured via SMTP and is required in production.
