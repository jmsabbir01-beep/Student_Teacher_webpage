# StudyVault — Secure Study Resource Sharing and Management System

A web-based platform where students and teachers can securely upload, organize,
search, and download academic resources (lecture notes, presentations, previous
question papers, lab reports, assignments), with admin-moderated approval and
an in-app notification system.

This is the **MVP build** for a university trimester project — it intentionally
focuses on a small, demonstrable core rather than every possible feature.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (via `better-sqlite3`) — file-based, zero setup required
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing
- **File uploads:** Multer, with server-side type & size validation
- **Frontend:** Plain HTML, CSS, and vanilla JavaScript (no framework/build step)

## Features (MVP scope)

| Feature | Student | Teacher | Admin |
|---|---|---|---|
| Register / Login (role-based) | ✅ | ✅ | (seeded) |
| Browse / search / filter approved resources | ✅ | ✅ | ✅ |
| Upload resource (goes to "pending") | ✅ | ✅ | — |
| Download resource | ✅ | ✅ | ✅ |
| Bookmark resources | ✅ | — | — |
| Edit / delete own resource | ✅ | ✅ | — |
| Approve / reject pending resources | — | — | ✅ |
| Manage users (view, enable/disable, delete) | — | — | ✅ |
| System stats dashboard | — | — | ✅ |
| In-app notifications (bell icon) | ✅ | ✅ | ✅ |

File validation enforced on upload: allowed types (PDF, DOC/DOCX, PPT/PPTX,
XLS/XLSX, ZIP, JPG, PNG, TXT) and a 20MB size limit, checked by both extension
and MIME type.

## Notification System

Every dashboard has a bell icon (top right) with an unread-count badge. Clicking
it opens a dropdown of recent notifications, which can be marked as read
individually or all at once. The badge count refreshes automatically every 15
seconds while a dashboard is open.

Notifications are triggered automatically at these points:

| Trigger | Who gets notified |
|---|---|
| A student or teacher uploads a new resource | Every Admin account |
| A student or teacher edits and resubmits a resource | Every Admin account |
| An admin approves a resource | The uploader (student or teacher) |
| An admin rejects a resource (with a reason) | The uploader (student or teacher) |
| An admin approves a resource uploaded by a **Teacher** | Every Student account (announcing the new material and which teacher posted it) |

This is implemented with a dedicated `notifications` table and a small
`utils/notifications.js` helper so every route creates notifications the same
way, plus a `routes/notifications.js` API (list / unread count / mark as read /
mark all as read) that every dashboard's shared bell UI talks to.

## Project Structure

```
studyvault/
├── server.js               # Express app entry point
├── config/db.js            # SQLite connection + schema (incl. notifications table)
├── middleware/
│   ├── auth.js               # JWT verification + role guard
│   └── upload.js             # Multer config + file validation
├── utils/
│   └── notifications.js      # Shared helper for creating notifications
├── routes/
│   ├── auth.js                 # register, login, /me
│   ├── resources.js            # upload, browse/search, download, edit, delete
│   ├── bookmarks.js            # add/remove/list bookmarks
│   ├── admin.js                 # approvals, user management, stats
│   └── notifications.js         # list / unread-count / mark-as-read
├── scripts/seedAdmin.js     # creates the first admin account
├── public/                  # frontend (static, served by Express)
│   ├── index.html             # login / register
│   ├── student.html            # student dashboard
│   ├── teacher.html            # teacher dashboard
│   ├── admin.html                # admin dashboard
│   ├── css/style.css
│   └── js/api.js                 # shared fetch/session helper + notification bell logic
├── uploads/                  # uploaded files are stored here
├── data/                     # studyvault.db (SQLite file) created on first run
└── .env.example
```

## Setup & Run

**Requirements:** Node.js 18+ installed on your machine (LTS versions like 20 or
22 are recommended — very new "Current" releases like Node 24 have caused
native-module compatibility crashes with `better-sqlite3` in testing).

```bash
# 1. Install dependencies
cd studyvault
npm install

# 2. Configure environment
cp .env.example .env

# 3. Create the first admin account
npm run seed:admin
# This prints the admin email/password from your .env — note it down.

# 4. Start the server
npm start
```

Then open **http://localhost:4000** in your browser.

## Demo Walkthrough (suggested order)

1. Register a **Teacher** account → upload a resource. Notice the confirmation
   message: the admin has been notified.
2. Log in as **Admin** → the bell icon shows an unread badge → open it to see
   "New resource pending review" → go to Pending Approvals → approve it.
3. Log back in as the **Teacher** → the bell shows a new notification: "Your
   resource was approved."
4. Register a **Student** account → the bell shows a notification: "New study
   resource available" naming the teacher and the material.
5. As Student → Browse Resources → the resource is now visible → download and
   bookmark it.

## Known MVP Limitations (by design, for the trimester scope)

- Notifications are in-app only (no email/push notifications).
- No file preview (download only).
- No email verification or password-reset flow.
- No pagination on the admin tables (fine at demo-data scale).
- Single admin-created-via-script; no in-app "create admin" UI.
- No virus/malware scanning of uploaded files.

See the accompanying project update document for the full scope discussion,
architecture rationale, and planned future work beyond this trimester.
