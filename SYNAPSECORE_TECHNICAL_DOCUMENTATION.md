# SynapseCore Systems — Complete Technical and Functional Documentation

## 1. Executive Overview

SynapseCore Systems is a modular digital platform that combines a public services/solutions website with a cybersecurity training academy and a learner management workflow. The platform is implemented as a Next.js 16 application using MongoDB and a custom JWT-based auth layer. It serves three primary audiences:

- Prospective clients visiting the marketing site
- Learners enrolling in cybersecurity courses
- Admins and support staff managing learners, content, payments, and support requests

### Platform goals

- Present SynapseCore as a professional cybersecurity, AI automation, and software services company
- Offer a learner academy with course catalog, enrollments, progress tracking, and certificates
- Support secure learner onboarding with verification, approval, and payment flows
- Give admins a central control plane for learner management, course content, payments, and support tickets
- Provide a deployable foundation for future expansion into live classes, AI tutoring, and mobile experiences

### Target users

- Guests: public visitors who browse marketing content and contact the company
- Learners: users who register, pay, enroll, study, and receive certificates
- Instructors / admins: staff who manage course content and learner operations
- Super Admin / Support Engineer: elevated roles for governance and operational support

### Main features

- Public marketing website with company pages and contact flows
- Learner academy with course browse/details/pay/enroll flows
- JWT-protected learner and admin areas
- Paystack payment initialization, callback verification, and webhook processing
- Course and lesson management via structured course modules
- Learner progress tracking and completion state
- Admin learner management including approval, suspension, and rejection
- Support ticket management and audit logging

### Technology stack

- Frontend: Next.js App Router with React and TypeScript/JavaScript components
- Styling: Tailwind CSS, Framer Motion, custom UI components
- Backend: Next.js route handlers and server-side utilities
- Database: MongoDB via Mongoose
- Authentication: custom JWT implementation with httpOnly cookies
- Payments: Paystack integration
- Email/SMS: Nodemailer and SMS integration layer
- Deployment target: Vercel-compatible Node/Next.js hosting

### Overall architecture

The platform uses a layered architecture:

1. Presentation layer
   - App Router pages under app/
   - Shared components under components/

2. API layer
   - Route handlers under app/api/
   - Authentication and authorization via lib/apiAuth.ts and middleware.ts

3. Service layer
   - authService.js, userService.js, enrollment.ts, paystack.js, email.js, sms.ts

4. Data layer
   - Mongoose models under lib/models/
   - MongoDB connection wrapper under lib/mongoose.js

5. Security layer
   - JWT verification
   - Cookie-based session handling
   - Role-based route access control
   - Paystack webhook validation

---

## 2. Complete Website Structure

This section documents the primary website pages and their role in the platform.

### Public marketing pages

#### Home
- URL: /
- Purpose: Main marketing landing page for SynapseCore Systems
- Components: Hero, trust strip, services grid, solutions overview, metrics, training promo, learner enrollment promo, testimonials, CTA
- API calls: None on initial render; may use client-side components without API calls
- Database models used: None directly
- Authentication requirements: None
- User interactions: Navigation, CTA clicks, contact/booking entry points

#### About
- URL: /about
- Purpose: Corporate overview and company positioning
- Components: mission, team, vision
- API calls: None
- Database models used: None
- Authentication requirements: None

#### Services
- URL: /services
- Purpose: Service catalog for cybersecurity, bug-fixing, web development, AI automation, team training
- Components: service details component, support CTAs
- API calls: None
- Database models used: None
- Authentication requirements: None

#### Pricing
- URL: /pricing
- Purpose: Show pricing plans and conversion call-to-action
- Components: pricing cards, CTA
- API calls: None
- Database models used: None
- Authentication requirements: None

#### Contact
- URL: /contact
- Purpose: Support/contact page with contact form and booking form
- Components: ContactForm, BookingForm, ContactInfo
- API calls: POST /api/support and POST /api/bookings or /api/booking depending on integration path
- Database models used: Support, Booking
- Authentication requirements: None for public submission
- User interactions: Fill forms, submit support/booking request

#### Blog / News / Resources
- URL: /blog, /resources, /stories, /testimonials, /faq, /integrations, /certifications
- Purpose: Publish marketing content and support documentation
- Components: content cards and listings
- API calls: /api/blog, /api/resources, /api/testimonials, /api/faqs, /api/integrations, /api/customer-stories
- Database models used: BlogPost, Resource, Testimonial, Faq, Integration, CustomerStory
- Authentication requirements: Public read access; admin-only management routes exist

### Authentication and account pages

#### Login
- URL: /login and /learner/login
- Purpose: Authenticate a client/admin user and issue a session cookie
- Components: form with email/password
- API calls: POST /api/auth/login or POST /api/learner/login
- Database models used: User
- Authentication requirements: None to access page; session required to access protected pages
- User interactions: Submit credentials, receive redirect

#### Register
- URL: /learner/register
- Purpose: Register a learner account and gather detailed profile data
- Components: multi-step registration form
- API calls: POST /api/learner/register
- Database models used: User, Payment, Course
- Authentication requirements: None
- User interactions: Complete registration, verify email, submit application

#### Forgot Password / Reset Password
- URL: /learner/forgot-password, /learner/reset-password
- Purpose: Request and complete password reset flow
- Components: reset form and verification code form
- API calls: POST /api/learner/forgot-password, POST /api/learner/reset-password
- Database models used: User
- Authentication requirements: None

#### Verify Email
- URL: /learner/verify-email
- Purpose: Confirm learner email with a verification code
- API calls: POST /api/learner/verify-email
- Database models used: User

### Learner pages

#### Learner Dashboard
- URL: /learner/dashboard
- Purpose: Landing page for learners after login
- Components: stats cards, quick links, recent activity
- API calls: GET /api/auth/me
- Database models used: User, Enrollment
- Authentication requirements: Required; learner role only
- User interactions: Navigate to courses, assessments, profile, settings

#### Courses Catalog
- URL: /learner/courses
- Purpose: Browse published courses
- Components: course cards, filters, call-to-action to enroll
- API calls: GET /api/courses and GET /api/learner/courses
- Database models used: Course
- Authentication requirements: Public read; enrollment/payment requires auth

#### Course Details
- URL: /learner/courses/[id]
- Purpose: Show course overview, module layout, price, and enrollment CTA
- Components: course summary, notes, module list, lesson player, certificate info
- API calls: GET /api/learner/courses/[id], GET /api/auth/me, POST /api/paystack/initialize
- Database models used: Course, Enrollment, Payment
- Authentication requirements: Public read; full lesson access requires enrollment
- User interactions: View content, initiate payment, continue learning

#### My Courses
- URL: /learner/my-courses
- Purpose: Show enrolled courses and progress
- Components: course cards, progress bars, continue buttons
- API calls: GET /api/learner/enrollments
- Database models used: Enrollment, Course
- Authentication requirements: Required; learner role only

#### Progress
- URL: /learner/progress
- Purpose: Track learner progress across enrolled courses
- Components: progress cards and course progression summary
- API calls: GET /api/learner/dashboard or /api/learner/course-progress
- Database models used: Enrollment
- Authentication requirements: Required

#### Assessments
- URL: /learner/assessments
- Purpose: Show quizzes and assessments associated with enrolled courses
- API calls: GET /api/learner/assessments
- Database models used: Enrollment, Quiz
- Authentication requirements: Required

#### Certificates
- URL: /learner/certificates
- Purpose: Display earned certificates
- API calls: GET /api/auth/me or learner profile API
- Database models used: User, Enrollment
- Authentication requirements: Required

#### Profile and Settings
- URL: /learner/profile, /learner/settings
- Purpose: Manage learner profile and preferences
- Components: profile form, settings form
- API calls: GET/PUT /api/learner/profile and /api/learner/settings
- Database models used: User
- Authentication requirements: Required

#### Support
- URL: /learner/support
- Purpose: Learner support interface for questions and issues
- API calls: /api/support
- Database models used: Support
- Authentication requirements: Required

### Admin pages

#### Admin Login
- URL: /admin/login
- Purpose: Authenticate admin and super-admin users
- Components: login form
- API calls: POST /api/auth/login
- Database models used: User
- Authentication requirements: None to view the page

#### Admin Dashboard
- URL: /admin/dashboard
- Purpose: Operational overview for admins
- Components: dashboard cards and charts
- API calls: /api/dashboard/stats, /api/dashboard/charts, /api/dashboard/activity
- Database models used: User, Enrollment, Payment, Support, Course
- Authentication requirements: Required; admin role only

#### Admin Learners
- URL: /admin/learners
- Purpose: Manage learner applications and onboarding state
- Components: learner list, approval/rejection controls
- API calls: GET /api/admin/learners and approval/rejection endpoints
- Database models used: User, Enrollment, Payment
- Authentication requirements: Required; admin role only

#### Admin Courses
- URL: /admin/courses
- Purpose: Manage course publishing and metadata
- Components: course tables and editors
- API calls: GET/POST/PUT/DELETE /api/admin/courses or /api/instructor/courses
- Database models used: Course
- Authentication requirements: Required; admin role only

#### Admin CMS
- URL: /admin/cms
- Purpose: Higher-level content management for content resources and site content
- Database models used: BlogPost, Resource, Faq, Testimonial, etc.

#### Admin Settings / Roles / Integrations / Reports / Webhooks
- URL: /admin/settings, /admin/roles, /admin/integrations, /admin/reports, /admin/webhooks
- Purpose: Operational administration of platform settings and external integrations
- API calls: corresponding /api/* routes
- Authentication requirements: Required; admin role only

### Client / support pages

#### Client Dashboard / Incidents
- URL: /client/dashboard, /client/incidents, /client/bookings
- Purpose: Support portal for clients with incident management and booking workflows
- Components: incident list, forms, booking tables
- API calls: /api/incidents, /api/bookings
- Database models used: Booking, Incident, IncidentTimeline, User
- Authentication requirements: Client role required

---

## 3. User Roles

### Guest
- Permissions:
  - Browse public marketing pages
  - Contact support through the public forms
  - View public course catalog metadata only (no lesson videos/files)
- Restrictions:
  - Cannot access learner/admin/client dashboards
  - Cannot enroll or access private content without authentication
- Accessible pages:
  - /
  - /about, /services, /pricing, /contact
  - /learner/courses (public catalog only)
  - /login, /learner/login
- APIs:
  - Public GET endpoints for marketing content and course catalog metadata

### Learner
- Permissions:
  - Register and log in
  - View and pay for published courses
  - Enroll, access lessons, track progress, and complete content
  - View own profile, settings, certificates, and support tickets
- Restrictions:
  - Cannot access admin routes
  - Cannot modify other learners’ records
  - Cannot see full lesson content before enrollment or payment
- Accessible pages:
  - /learner/dashboard
  - /learner/courses, /learner/courses/[id]
  - /learner/my-courses, /learner/progress, /learner/assessments
  - /learner/profile, /learner/settings, /learner/support
- APIs:
  - /api/learner/*
  - /api/paystack/initialize, /api/paystack/verify
  - /api/auth/me

### Instructor / Admin content manager
- Permissions:
  - Create and edit course content, modules, lessons, quizzes, and assignments
  - Publish courses
  - Manage learner-facing course content
- Restrictions:
  - Not all admin functions are available unless assigned higher role
  - Content management is tied to the admin route layer and the instructor APIs
- Accessible pages:
  - /admin/courses
  - /admin/cms
- APIs:
  - /api/instructor/courses
  - /api/instructor/courses/[id]/modules
  - /api/instructor/courses/[id]/modules/[moduleId]/lessons
  - /api/instructor/quizzes

### Admin
- Permissions:
  - Manage learners, enrollments, support tickets, settings, roles, integrations, reports
  - Create/edit content and approve learner accounts
  - Manage payments and support activity
- Restrictions:
  - Does not necessarily have full super-admin capabilities unless assigned that role
- Accessible pages:
  - /admin/dashboard, /admin/learners, /admin/courses, /admin/support, /admin/settings, /admin/reports
- APIs:
  - /api/admin/*
  - /api/instructor/*
  - /api/payments, /api/notifications, /api/settings

### Super Admin
- Permissions:
  - All admin capabilities plus elevated governance and platform control
  - Can manage special roles such as Super Admin and Support Engineer
- Restrictions:
  - None within the platform’s implemented permission model
- Accessible pages:
  - All admin and support routes
- APIs:
  - All admin/instructor APIs plus role-sensitive endpoints

---

## 4. Authentication System

### Registration

Learner registration is handled through the learner registration route at /api/learner/register. It accepts a large form payload, builds a full learnerProfile object, creates a user with role learner, status pending, and generates a verification code.

Key behaviors:
- Passwords are not stored in plaintext because the User model hashes them in a pre-save hook
- Learners are created with status pending until an admin approves them
- Email verification is enforced for learner login

### Login

Standard login is handled by /api/auth/login. The route validates a login schema, checks credentials, sets an httpOnly cookie named token, and returns a redirect target based on the role.

For learner-specific login, there is also a learner login route at /api/learner/login that follows a similar flow.

### JWT/session flow

- A JWT is generated in services/authService.js with payload fields id, email, and role
- The token is stored in an httpOnly cookie named token
- The middleware and API authentication helpers read the cookie and verify the token
- The token expiration is controlled by JWT_EXPIRES_IN (default 7d)

### Cookies

- Cookie name: token
- Stored attributes: httpOnly, sameSite: strict, path: /
- Secure only in production
- Used for browser-based requests and page-level route protection

### Password hashing

- Password hashing uses bcrypt
- The User model applies the hash in a pre-save hook
- Login compares the supplied password to the stored hash with bcrypt.compare

### Route protection

- Middleware in middleware.ts protects /admin, /client, and /learner routes
- For admin routes, a valid token and admin role are required
- For client routes, a valid token and client role are required
- For learner routes, a valid token and learner role are required, with public exceptions for catalog pages and auth pages

### Middleware

The middleware implementation performs:
- Path detection
- Token extraction from cookies
- JWT verification
- Role checks using helpers from lib/guards.ts

### Authorization

Authorization is implemented through:
- lib/apiAuth.ts helpers authenticateAPI, requireRole, withAuth, withRoleAuth
- lib/guards.ts role helpers isAdmin, isClient, isLearner

---

## 5. Database Documentation

The application uses a single MongoDB database named synapsecoresystem.

### Core model overview

- User
- Course
- Module (embedded in Course)
- Lesson (embedded in Course.modules)
- Quiz
- Enrollment
- Payment
- Certificate (represented via Enrollment.certificate and course certificate config)
- Notification
- Message
- Booking
- Support
- Role
- Settings
- BlogPost
- Resource
- Integration

### User

Collection: users

Fields:
- id: string, unique
- fullname: string, required
- email: string, required, unique
- phone: string, conditionally required
- password: string, required, hashed
- role: enum including admin, client, learner, Super Admin, Support Engineer, Client/User
- status: pending/approved/rejected
- emailVerified: boolean
- verificationCode: string
- resetPasswordCode: string
- resetPasswordExpires: Date
- learnerProfile: embedded object for learner-specific data
- settings: object
- createdAt, updatedAt

Relationships:
- User has many Enrollments
- User has many Payments
- User may be assigned to Bookings or Support tickets

Indexes:
- email unique
- id unique

Validation:
- fullname required
- email required and unique
- password length minimum 6
- role enums enforced

### Course

Collection: courses

Fields:
- title, description, notes
- category, level, price, duration, thumbnail
- modules: array of embedded modules
- quizzes: array of embedded quizzes (backward compatibility)
- certificate: embedded certificate config
- instructor/instructors metadata
- rating, enrollmentCount, completionRate
- published, featured
- createdAt, updatedAt

Relationships:
- Course has many enrollments via Enrollment.courseId
- Course may be referenced by Payment.courseId

Indexes:
- None explicitly defined in the model

Validation:
- Title required
- Category required
- Level default Beginner
- Price default 0

### Module

Embedded in Course.modules

Fields:
- title, description, notes
- order
- lessons: array of embedded lessons
- quiz reference
- assignment object
- unlockRule

### Lesson

Embedded in Course.modules[].lessons

Fields:
- title, description, notes
- videos array with title/url/type/duration/scheduledAt
- duration
- downloads array
- quiz reference
- assignment object
- discussionEnabled
- subtitles
- playground
- aiTutor
- completed flag

### Quiz

Collection: quizzes

Fields:
- title, description, scope, questions, passingScore
- courseId reference
- createdBy reference to User
- createdAt, updatedAt

### Enrollment

Collection: enrollments

Fields:
- learnerId: ObjectId ref User
- courseId: ObjectId ref Course
- status: active/completed/suspended
- progress with completedLessons, totalLessons, progressPercentage, lastAccessedAt
- lessonProgress entries for module/lesson completion
- assessments array
- certificate object for earned status and URL
- totalTimeSpent
- enrolledAt, completedAt

Relationships:
- One learner can have many enrollments
- One course can be enrolled by many learners

Indexes:
- Unique composite index on learnerId + courseId

Validation:
- Required learnerId and courseId

### Payment

Collection: payments

Fields:
- userId / learnerId / courseId / bookingId
- amount, paymentMethod, transactionId, status, paymentReference
- paymentGateway, description, paidAt, createdAt, updatedAt

Relationships:
- Payment belongs to a user and optionally a course

Indexes:
- paymentReference indexed
- transactionId unique

### Notification

Collection: notifications

Fields:
- recipientId, senderId
- type, title, message, category, priority, actionUrl, metadata
- isRead, expiresAt
- createdAt, updatedAt

Indexes:
- recipientId + isRead + createdAt descending

### Message

Collection: messages

Fields:
- name, email, subject, message, createdAt

### Booking

Collection: bookings

Fields:
- userId, serviceType, description, priority, status, assignedTo, attachments
- createdAt, updatedAt

### Support

Collection: support

Fields:
- name, email, subject, message, priority, createdAt, updatedAt

### ER diagram

```text
User 1---* Enrollment *---1 Course
User 1---* Payment *---1 Course (optional)
User 1---* Notification
User 1---* Booking
User 1---* Support
Course 1---* Quiz
Course 1---* Module (embedded)
Module 1---* Lesson (embedded)
Enrollment 1---* LessonProgressEntry
```

---

## 6. Course Management

### Category creation

Courses are organized by category values in the Course model, including Security, Hacking, Networks, Compliance, Forensics, Administration, AI Automation, Web Development, and Cloud Security.

### Instructor/course creation workflow

1. An admin/instructor creates a course record through the instructor or admin course API
2. The course is initially created with published false unless provided otherwise
3. The course metadata is edited through the course API
4. Content is appended by creating modules and lessons
5. The completed course is marked published and optionally featured

### Module creation

Modules are added to the Course.modules array through the instructor modules API. Each module contains:
- title
- description
- notes
- order
- lessons array
- assignment
- unlockRule

### Lesson creation

Lessons are added to modules through the instructor lessons API. Each lesson can include:
- title and description
- markdown notes
- videos array
- downloads array
- quiz reference
- assignment object
- discussionEnabled flag
- subtitles/playground/aiTutor options

### Video handling

The lesson video schema supports:
- recorded, live, or zoom video types
- title and duration
- scheduledAt for live sessions

### Downloads / notes

- Downloads are stored as file metadata with label/url/fileType
- Lesson notes are stored as markdown text and rendered in the player

### Quizzes and assignments

- Quizzes are stored separately in the Quiz collection
- Quiz references can be attached to lessons and modules
- Assignment objects can be attached to lessons and modules

### Publishing workflow

- Create course metadata
- Add modules/lessons/quizzes
- Mark course as published true
- Optionally feature the course
- Make it visible in the public learner catalog

---

## 7. Student Learning Flow

The learner journey is implemented as a guided progression from public signup to paid enrollment and course completion.

1. Registration
   - User enters personal and identity information
   - Account is created as learner with pending status
   - Verification code is generated and sent by email/SMS

2. Login
   - Learner logs in with email/password
   - JWT token is issued and stored in a cookie
   - Learner is redirected to the protected learner area

3. Browse Courses
   - Learner opens /learner/courses
   - Published courses are loaded from the course catalog

4. Course Details
   - Learner opens /learner/courses/[id]
   - Public metadata is shown; full lesson content remains protected until enrollment

5. Pay Now
   - Learner clicks the Paystack enrollment button
   - The app calls /api/paystack/initialize with courseId and amount

6. Paystack
   - Paystack creates a payment transaction and returns an authorization URL
   - Learner is redirected to Paystack

7. Verification
   - Paystack redirects back to /api/paystack/verify?reference=...
   - The app verifies the transaction and updates the payment record

8. Enrollment
   - Successful payment triggers enrollment creation through createEnrollmentForPayment
   - Enrollment status becomes active

9. Dashboard
   - Learner lands on /learner/dashboard and /learner/my-courses
   - Progress summary is retrieved from the enrollment and user profile data

10. Course Player
    - Learner can open lessons, view notes, videos, and downloads
    - Progress is saved through /api/learner/course-progress

11. Complete Lessons
    - Learner completes lessons and the app records progress entries

12. Take Quizzes / Assignments
    - Quiz references and assignment metadata are surfaced in the player experience

13. Certificate
    - Course completion can emit a certificate when configured

14. Course Completion
    - Final completed state is reflected in the learner’s enrollment record and dashboard metrics

---

## 8. Paystack Integration

### Initialization

The initialization route is POST /api/paystack/initialize.

Flow:
1. Validate the authenticated learner session
2. Resolve course metadata from Course by courseId
3. Build metadata containing courseId, learnerId, fullname, and courseTitle
4. Call initializePayment from lib/paystack.js
5. Create a Payment document with status pending and transaction reference
6. Return authorizationUrl, reference, and paymentId to the client

### Callback and verification

The verify route is GET /api/paystack/verify.

Flow:
1. Read the reference query parameter
2. Fetch the payment record by transactionId
3. Call verifyPayment from lib/paystack.js
4. Update payment status to completed/failed/pending
5. If completed and the course exists, create enrollment through createEnrollmentForPayment
6. Redirect the learner to /learner/my-courses with payment states in query params

### Webhooks

The webhook route is POST /api/paystack/webhook.

Flow:
1. Read the x-paystack-signature header
2. Compute HMAC SHA-512 over the raw request body
3. Compare against the expected signature using the configured webhook secret
4. Parse the event payload
5. On charge.success, mark payment completed and create enrollment
6. On charge.failed, mark payment failed
7. Return 200 to acknowledge processing

### Signature verification

The implementation uses crypto.createHmac('sha512', secret).update(body).digest('hex') and compares with the provided signature via timingSafeEqual.

### Environment variables

Required or expected values:
- PAYSTACK_SECRET_KEY
- PAYSTACK_PUBLIC_KEY
- PAYSTACK_WEBHOOK_SECRET
- NEXTAUTH_URL or NEXT_PUBLIC_BASE_URL for callback URL generation

### Payment records

Payment records are created with:
- userId, learnerId, courseId
- amount, paymentMethod paystack, transactionId, paymentReference
- status pending -> completed/failed

### Enrollment creation

Enrollment creation is idempotent and implemented in lib/enrollment.ts.

It protects against duplicate enrollments and webhook races by using:
- findOne on Enrollment to detect existing records
- an upsert-based create strategy with a unique composite index
- conditional increments to Course.enrollmentCount only when a truly new enrollment was created

### Error handling

The implementation handles:
- missing courseId / amount
- invalid or missing authentication
- Paystack API errors
- missing or invalid payment records
- webhook signature failure

### Retry handling

Because both verify and webhook can trigger enrollment creation, the implementation is designed to be safe on retries. The idempotency logic avoids duplicate enrollments and duplicate course count updates.

### Duplicate webhook protection

The unique enrollment index and idempotent enrollment helper make the platform resilient to duplicate webhook deliveries and duplicate verification callbacks.

### Sequence diagram

```text
Learner -> App: click Pay Now
App -> Paystack: initialize payment
Paystack -> App: authorization URL + reference
App -> Learner: redirect to Paystack
Learner -> Paystack: complete payment
Paystack -> App: webhook / verify callback
App -> MongoDB: update payment status
App -> MongoDB: create or reuse enrollment
App -> Learner: redirect to My Courses
```

---

## 9. API Documentation

The API is implemented as Next.js route handlers under app/api/.

### Authentication API

#### POST /api/auth/register
- Authentication: None
- Request body: fullname, email, phone, password, role
- Response: 201 with user and token cookie
- Errors: 400 for missing fields; 400 for duplicate email; 500 for internal errors

#### POST /api/auth/login
- Authentication: None
- Request body: email, password
- Response: 200 with success, data user, redirect
- Errors: 401 if invalid credentials

#### GET /api/auth/me
- Authentication: Required via cookie token
- Response: user profile data
- Errors: 401/404

#### POST /api/auth/logout
- Authentication: None
- Response: clears token cookie

### Learner API

#### POST /api/learner/register
- Authentication: None
- Request body: full learner registration payload
- Response: 201 with success, user, payment info
- Errors: 400 for validation issues; 500 for server errors

#### POST /api/learner/login
- Authentication: None
- Request body: email, password
- Response: 200 with user and cookie

#### GET /api/learner/courses
- Authentication: None for public catalog list
- Response: list of published course metadata

#### GET /api/learner/courses/[id]
- Authentication: Optional; returns safe metadata if unauthenticated
- Response: full course details for enrolled users, safe metadata for guests

#### POST /api/learner/enroll
- Authentication: Required, learner role
- Request body: courseId
- Response: 200 with success message
- Errors: 401/403/400/404

#### GET /api/learner/enrollments
- Authentication: Required, learner role
- Response: list of enrolled courses with progress

#### GET /api/learner/course-progress
- Authentication: Required, learner role
- Query param: courseId
- Response: completed lessons array

#### POST /api/learner/course-progress
- Authentication: Required, learner role
- Request body: courseId, moduleIndex, lessonIndex, completed=true
- Response: updated completion count

#### GET/PUT /api/learner/profile
- Authentication: Required
- Response: current profile or updated profile

#### GET/PUT /api/learner/settings
- Authentication: Required
- Response: settings object

### Instructor API

#### GET/POST /api/instructor/courses
- Authentication: Required, admin role
- Response: course list or created course

#### GET/PUT/DELETE /api/instructor/courses/[id]
- Authentication: Required, admin role
- Response: course metadata or deletion confirmation

#### POST/PUT/DELETE /api/instructor/courses/[id]/modules
- Authentication: Required, admin role
- Response: module created/updated/deleted

#### POST/PUT/DELETE /api/instructor/courses/[id]/modules/[moduleId]/lessons
- Authentication: Required, admin role
- Response: lesson created/updated/deleted

#### GET/POST /api/instructor/quizzes
- Authentication: Required, admin role
- Response: quizzes or created quiz

### Payment API

#### POST /api/paystack/initialize
- Authentication: Required
- Request body: courseId, amount, email, fullname
- Response: authorizationUrl, reference, paymentId

#### GET /api/paystack/verify
- Authentication: None; callback route
- Query param: reference
- Response: redirect to learner pages

#### POST /api/paystack/webhook
- Authentication: None; signature validated
- Request body: Paystack event payload
- Response: 200/401/500

### Admin API

#### GET /api/admin/learners
- Authentication: Required, admin role
- Response: learner stats and normalized learner records

#### GET/POST /api/admin/courses
- Authentication: Required, admin role
- Response: courses list or created course

### Support / content APIs

- /api/support for support ticket creation
- /api/contact and /api/booking variants for contact and booking cases
- /api/blog, /api/resources, /api/faqs, /api/testimonials, /api/integrations, /api/customer-stories for public content management

---

## 10. Instructor CMS

The current CMS implementation is lightweight but functional. It supports course authoring rather than a full drag-and-drop editor.

### Dashboard
- Admin/instructor users can access the course administration routes
- Content is managed through the admin interface and instructor APIs

### Course editor
- Course fields include title, description, category, level, price, duration, thumbnail, notes, instructor, certificate config, published/featured status

### Module editor
- Modules can be created, updated, and deleted
- Each module has ordering, unlock rules, notes, and assignment metadata

### Lesson editor
- Lessons can be created with video arrays, notes, downloads, quiz links, assignments, and discussion flags

### Quiz builder
- Quiz records are stored separately and can be created with questions, options, correct answers, explanations, passing score

### Assignment builder
- Lesson and module assignment metadata can be attached directly

### Publishing
- Courses are made visible by setting published true
- The learner catalog only returns published courses

---

## 11. Student Dashboard

The learner dashboard provides a compact view of the learner’s learning state.

### My Courses
- Shows enrolled courses with progress bars and continue buttons
- Uses the enrollments API to populate course cards

### Progress
- Tracks completed lesson count and percentage
- Uses Enrollment.progress and lessonProgress arrays

### Certificates
- Certificate status is derived from Enrollment.certificate and course certificate config

### Downloads
- Downloads appear inside the lesson player when attached to a lesson

### Profile
- Learner profile data is persisted in the User document under learnerProfile and is editable through the profile API

### Settings
- Learner preferences and notification settings are stored under User.settings

---

## 12. Course Player

The course player is implemented in components/learner/lesson-player.tsx and is used from the course detail page.

### Video player
- Uses the HTML video element
- Supports a single video or multiple videos per lesson
- Handles lesson completion when the video ends

### Multiple videos
- The lesson video array supports multiple entries and switching via video selector buttons

### Notes
- Lesson notes are stored as markdown text and rendered into simple sections and paragraphs

### Downloads
- Download links are shown in a dedicated download panel

### Quiz
- A quiz reference appears in the lesson panel when present

### Assignment
- Assignment metadata is displayed if attached to the lesson

### Discussion
- discussionEnabled renders a simple notice panel

### Progress
- Course detail page tracks lesson completion state locally and syncs to the backend

### Next Lesson
- The lesson navigation logic in the course detail page is based on sequential lesson unlocking and completion

---

## 13. Security

### JWT
- JWTs are signed with JWT_SECRET and stored in a cookie
- The app validates the token before granting access to protected pages and APIs

### Middleware
- Route-level protection blocks access to unauthorized routes
- Learner, admin, and client routes are each gated by role checks

### Rate limiting
- The repository contains rate limiter utilities under lib/rateLimiter.js and lib/nextRateLimiter.js, but the current route handlers do not appear to enforce them broadly

### Input validation
- Some route handlers use zod schemas (loginSchema, supportTicketSchema) for validation
- The project would benefit from more systematic request validation across course and enrollment endpoints

### Password hashing
- Hashing is enforced through bcrypt in the User model

### XSS protection
- The app uses React escaping and server-side rendering, which helps reduce XSS risk
- However, content stored in course notes and rich text-like fields should be sanitized before rendering if richer editing is introduced

### CSRF considerations
- The application uses cookies for auth, which makes CSRF a concern in the browser
- The repository contains a CSRF helper in lib/csrf.js, but it is not fully wired into all mutation routes

### MongoDB security
- The app uses a MongoDB connection string from environment variables
- Use Atlas network restrictions and database user permissions in production

### Paystack security
- Webhook signatures are verified using HMAC SHA-512
- The secret key should never be exposed in client code

### Webhook verification
- Webhook route verifies signature before applying state changes
- This protects the system from forged payment events

---

## 14. Deployment

### Development
- Run npm run dev
- The app expects .env.local with MongoDB and JWT variables

### Testing
- Validate route flows locally with seeded data and local MongoDB
- Test learner registration, email verification, payment initiation, and webhook flows

### Production
- Build with npm run build
- Start with npm run start
- Deploy to Vercel or compatible Node hosting

### Environment variables
- MONGODB_URI
- JWT_SECRET
- NEXTAUTH_URL or NEXT_PUBLIC_BASE_URL
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM
- PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY, PAYSTACK_WEBHOOK_SECRET

### Build process
- Next.js build compiles the app and routes
- Static and dynamic server routes are built as part of the production output

### Vercel deployment
- The app is compatible with Vercel’s Next.js deployment
- Set environment variables in the Vercel project settings
- Configure domain and production origin values

### Domain configuration
- The application relies on the base URL for callback URLs and public links
- Ensure the production domain matches Paystack callback and webhook configuration

### HTTPS
- HTTPS is expected in production
- Secure cookies require the app to run behind HTTPS

### DNS
- Configure DNS to point the production domain to Vercel or the hosting provider

### Monitoring
- Implement logging around auth, payments, and enrollment flows
- Capture webhook failures and payment verification issues

### Logging
- The app already logs errors to the console in many routes
- Production should route logs to a structured logging platform

### Backups
- Maintain MongoDB Atlas backups and application-level exports if the platform becomes production-critical

---

## 15. Folder Structure

### app/
- Contains the App Router pages and API routes
- app/api contains server endpoints
- app/learner contains all learner pages
- app/admin contains admin pages
- app/client contains client/support pages
- app/page.tsx is the homepage

### components/
- Reusable UI components like navbar, pricing plans, forms, lesson player, homepage sections

### lib/
- Core shared utilities and models
- auth.js, apiAuth.ts, auth guards, config, validation, paystack helpers, mongoose connection
- models/ contains the Mongoose schemas

### services/
- authService.js, userService.js, auditService, email, SMS helpers

### public/
- Static assets and support files

### scripts/
- Utility scripts such as seed scripts and setup helpers

### types/
- Shared TypeScript types for the app

---

## 16. Third-Party Services

### Paystack
- Payment gateway for course purchase flow
- Used for initialization, verification, and webhook events
- Requires secret/public/webhook environment variables

### MongoDB Atlas
- Primary persistence layer for users, courses, enrollments, payments, support records
- Should be configured with proper users and network restrictions

### Vercel
- Recommended hosting target for Next.js deployment
- Supports environment variables and domain management

### Email provider
- Nodemailer is configured to use SMTP
- The current environment uses Gmail SMTP settings for verification and notifications

### Domain provider
- Any registrar or DNS provider can be used; the platform expects a production domain and HTTPS

### External APIs
- Paystack API
- SMTP provider
- Optional SMS provider integration

---

## 17. Testing

### Unit testing
- The repository does not yet present a dedicated unit test suite
- Recommended scope: auth helpers, enrollment logic, paystack helpers, validation schemas

### Integration testing
- Test the interaction between route handlers, Mongoose models, and auth helpers
- Cover payment initialization, webhook processing, and learner enrollment creation

### End-to-end testing
- Exercise the full learner flow: registration → email verification → login → course browse → payment → enrollment → course player

### Manual testing checklist
- Verify that guest users can browse public pages
- Verify that learner registration creates a pending account
- Verify that email verification blocks unverified learners from login
- Verify that admin can approve learners
- Verify that paystack initialization returns a URL
- Verify that webhook success creates enrollment
- Verify that course videos/downloads are hidden from unauthenticated users
- Verify that learner progress updates correctly

---

## 18. Future Roadmap

### Live classes
- Add real-time live-class scheduling, attendance, and video sessions

### AI Tutor
- Add chat-based assistance tied to lessons and modules

### Mobile app
- Build a React Native or mobile-first experience for learners

### Notifications
- Introduce in-app and email notifications with richer triggers

### Certificates
- Replace the basic certificate flow with a formal certificate generation pipeline for completed courses

### Analytics
- Add learner analytics dashboards for course completion, retention, and performance

### Multi-instructor support
- Expand the course ownership model from single admin-driven content management to multi-instructor collaboration

### Affiliate system
- Introduce referral-based marketplace revenue and learner acquisition tracking

### Subscription plans
- Replace one-off course payments with recurring subscriptions and membership access

---

## 19. Known Issues

- The platform mixes several overlapping auth implementations and should be consolidated around a single source of truth
- Some routes use different auth helpers and cookie expectations, causing subtle inconsistencies
- The learner registration flow is broad and could benefit from stronger schema validation and better separation of concerns
- The course player currently handles progress and lesson state in a lightweight way and does not yet support a fully structured learning analytics pipeline
- The CMS is functional but not yet a polished enterprise-grade authoring tool
- Some route definitions appear to overlap or duplicate similar functionality across admin/instructor and learner paths
- More complete rate limiting and CSRF protections should be added to state-changing routes

---

## 20. Launch Readiness Report

### Percentage complete
- Overall implementation status: approximately 75–85% complete for a working platform foundation
- Public marketing site, learner academy, admin management, payments, and auth are present and functional at a foundational level

### Production readiness
- The platform is not yet fully production-hardened
- Core flows exist, but operational hardening, testing, monitoring, and policy enforcement still need strengthening before a full public launch

### Remaining blockers
- Consolidate auth and session handling into a single consistent model
- Add broader validation and error handling to all mutation routes
- Harden CSRF and rate limiting protections
- Add real regression tests for authentication, enrollment, and payment flows
- Verify webhook secret configuration and callback domain setup in production
- Consider production logging, monitoring, and backup strategy

### Risk assessment
- Medium risk for launch if the platform is used in a production environment without further hardening
- Payment and learner enrollment flows are functional but should be tested exhaustively before release
- Security posture should be strengthened before public use

### Recommended launch checklist
- Confirm environment variables and secrets
- Verify database connectivity and MongoDB indexing
- Test full learner registration and login workflow
- Test Paystack initialization and webhook delivery
- Test admin approval workflow for learners
- Verify course publish/unpublish behavior
- Review access control for protected routes
- Configure monitoring/logging and backup strategy
- Prepare support and incident response procedures

---

## Implementation Notes for the Next Engineer

The platform is maintainable but should be treated as an evolving product rather than a completed enterprise SaaS. The most important files to understand first are:

- [package.json](package.json)
- [middleware.ts](middleware.ts)
- [lib/auth.js](lib/auth.js)
- [lib/apiAuth.ts](lib/apiAuth.ts)
- [lib/guards.ts](lib/guards.ts)
- [lib/mongoose.js](lib/mongoose.js)
- [lib/paystack.js](lib/paystack.js)
- [lib/enrollment.ts](lib/enrollment.ts)
- [lib/models/Course.ts](lib/models/Course.ts)
- [lib/models/Enrollment.ts](lib/models/Enrollment.ts)
- [lib/models/Payment.js](lib/models/Payment.js)
- [lib/models/User.js](lib/models/User.js)
- [app/api/paystack/initialize/route.ts](app/api/paystack/initialize/route.ts)
- [app/api/paystack/verify/route.ts](app/api/paystack/verify/route.ts)
- [app/api/paystack/webhook/route.ts](app/api/paystack/webhook/route.ts)
- [app/api/learner/register/route.ts](app/api/learner/register/route.ts)
- [app/api/learner/enroll/route.ts](app/api/learner/enroll/route.ts)
- [app/api/learner/course-progress/route.ts](app/api/learner/course-progress/route.ts)
- [app/api/instructor/courses/route.ts](app/api/instructor/courses/route.ts)
- [app/api/instructor/courses/[id]/modules/route.ts](app/api/instructor/courses/[id]/modules/route.ts)
- [app/api/instructor/courses/[id]/modules/[moduleId]/lessons/route.ts](app/api/instructor/courses/[id]/modules/[moduleId]/lessons/route.ts)

This document should be treated as the canonical technical handoff for the platform until a more formal architecture and API spec is created.
