# vtopx

`vtopx` is a VTOP-style student portal built with Node.js, Express, MongoDB, and plain HTML/CSS/JavaScript.

It is a multipage portal with:

- MongoDB-based login credentials
- student dashboard
- academics page
- requests page
- admin-only user management
- visible CRUD operations stored in the `vtopx` database

## Features

- Student and admin authentication using MongoDB
- Password hashing with `bcryptjs`
- Session handling with JWT + cookies
- Multipage UI:
  - `/`
  - `/dashboard`
  - `/academics`
  - `/requests`
  - `/admin/users`
- Admin-only user CRUD:
  - create user
  - update user
  - delete user
  - list all users
- MongoDB-backed landing page stats
- Seeded portal data for students:
  - attendance
  - timetable
  - marks
  - assignments
  - spotlight notices

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS
- Vanilla JavaScript

## Database

This project uses the MongoDB database:

```text
vtopx
```

Default connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/vtopx
```

Main collections:

- `students`
- `servicerequests`

## Project Structure

```text
student-portal/
|-- config/
|-- controllers/
|-- middleware/
|-- models/
|-- public/
|-- routes/
|-- .env.example
|-- .gitignore
|-- package.json
`-- server.js
```

## Pages

### 1. Login page

Route:

```text
/
```

Dynamic landing page that shows live MongoDB stats such as:

- total users
- total admins
- total requests
- latest users

### 2. Dashboard

Route:

```text
/dashboard
```

Shows:

- spotlight notices
- quick links
- overview cards
- today timetable
- recent requests

### 3. Academics

Route:

```text
/academics
```

Shows:

- registered courses
- attendance
- marks
- assignments
- assignment submission action

### 4. Requests

Route:

```text
/requests
```

Shows:

- request creation form
- leave request dates
- request history
- request stats

### 5. Admin Users

Route:

```text
/admin/users
```

Admin only.

Allows:

- adding users
- editing users
- deleting users
- viewing all MongoDB-backed login accounts

## Authentication

Users can log in with:

- registration number
- email

Credentials are stored in MongoDB and passwords are hashed before saving.

## Default Admin Account

On first startup, the app creates a default admin if no admin exists.

Default admin:

```text
Email: admin@vtopx.edu
Reg No: VTOPXADMIN01
Password: Admin@123
```

Change these in your environment for production use.

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vtopx
JWT_SECRET=my_super_secret_key_12345
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=admin@vtopx.edu
DEFAULT_ADMIN_PASSWORD=Admin@123
DEFAULT_ADMIN_REGNO=VTOPXADMIN01
```

## Installation

### 1. Clone the repo

```powershell
git clone https://github.com/LielStephen/vtopx.git
cd vtopx
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Create `.env`

Copy `.env.example` to `.env` and update values if needed.

### 4. Start MongoDB

Make sure MongoDB is running locally on port `27017`.

### 5. Run the app

```powershell
npm start
```

Open:

```text
http://localhost:5000
```

## Development Commands

Run app:

```powershell
npm start
```

Run with nodemon:

```powershell
npm run dev
```

Check syntax:

```powershell
npm run check
```

## API Overview

### Public

- `GET /api/public/landing`

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Portal

- `GET /api/portal/dashboard`
- `GET /api/portal/academics`
- `GET /api/portal/requests`
- `POST /api/portal/requests`
- `POST /api/portal/assignments/:assignmentId/submit`

### Admin

- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/:userId`
- `DELETE /api/admin/users/:userId`

## CRUD in MongoDB

User CRUD is visible in MongoDB through the `students` collection.

Examples in `mongosh`:

```javascript
use vtopx
show collections
db.students.find().pretty()
db.servicerequests.find().pretty()
```

Find one student:

```javascript
db.students.find({ regNo: "23BCE20073" }).pretty()
```

## Important Notes

- `.env` is ignored by git and should not be committed.
- Passwords are hashed and not stored in plain text.
- The app uses cookies for authenticated routes.
- Admin page access is restricted by role.

## Future Improvements

- better role management
- search and filtering in admin users page
- course-wise request tracking
- deployment configuration
- file uploads for assignments and documents

## GitHub

Repository:

[https://github.com/LielStephen/vtopx](https://github.com/LielStephen/vtopx)
