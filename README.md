# Zyra

Zyra is a full-stack issue tracking app built with React, TypeScript, Express, Prisma, and MySQL.

The goal of this project was to build a clean and practical issue tracker that covers the main things you usually need in a real system: authentication, issue management, filtering, dashboard stats, and export support.

It has a modern dark UI, a simple workflow for handling issues, and a backend structure that is easy to extend later.

---

## What this project can do

### Issue management
- Create, view, update, and delete issues
- Store issue title, description, status, priority, and severity
- Move issues through a simple workflow:
  - Open
  - In Progress
  - Resolved
  - Closed

### Dashboard
- Show total issue count
- Show issue counts by status
- Show priority breakdown
- Show recently created issues

### Search and filtering
- Search issues by text
- Filter by status, priority, and severity
- Sort by created date, updated date, title, or priority
- Browse issues with pagination

### Export
- Export issues as CSV
- Export issues as JSON

### Authentication
- Register a new user account
- Log in with email and password
- Use JWT-based authentication for protected routes

---

## Tech stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Axios

### Backend
- Express
- TypeScript
- Prisma
- MySQL
- JWT
- bcryptjs

---

## Project structure

```bash
issue-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.ts
│
├── package.json
└── README.md
```

---

## Getting started

### Prerequisites
Make sure you have these installed:

- Node.js 18 or newer
- npm
- MySQL 8 or newer

---

## Installation

### 1. Install dependencies
From the project root:

```bash
npm install
npm run install:all
```

---

### 2. Set up backend environment variables
Go to the backend folder and copy the example file:

```bash
cd backend
cp .env.example .env
```

Now open `backend/.env` and update the values.

Example:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/issue_tracker"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

If your MySQL root account does not have a password, your connection string may look like this instead:

```env
DATABASE_URL="mysql://root:@localhost:3306/issue_tracker"
```

---

### 3. Create the database
Make sure MySQL is running, then create the database:

```sql
CREATE DATABASE issue_tracker;
```

---

### 4. Push the Prisma schema
Still inside the backend folder, run:

```bash
npm run db:generate
npm run db:push
```

If you want to use migrations instead of `db push`, run:

```bash
npm run db:migrate
```

---

### 5. Start the project
From the project root:

```bash
npm run dev
```

This will start both apps:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

You can also run them separately:

```bash
npm run dev:frontend
npm run dev:backend
```

---

## API overview

All issue-related endpoints require a valid JWT token in the `Authorization` header.

Example:

```http
Authorization: Bearer <token>
```

### Auth routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current logged-in user |

### Issue routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/:id` | Get one issue by ID |
| POST | `/api/issues` | Create a new issue |
| PUT | `/api/issues/:id` | Update an issue |
| DELETE | `/api/issues/:id` | Delete an issue |
| GET | `/api/issues/stats` | Get dashboard stats |
| GET | `/api/issues/export?format=csv` | Export issues as CSV |
| GET | `/api/issues/export?format=json` | Export issues as JSON |

### Supported issue query params

| Param | Description |
|------|-------------|
| `page` | Page number |
| `limit` | Number of items per page |
| `search` | Search text |
| `status` | Filter by status |
| `priority` | Filter by priority |
| `severity` | Filter by severity |
| `sortBy` | Sort field |
| `sortOrder` | `asc` or `desc` |

---

## Build for production

To build the frontend:

```bash
npm run build:frontend
```

The production frontend files will be created inside:

```bash
frontend/dist/
```

For production, make sure your backend environment values are updated properly.

Example:

```env
NODE_ENV=production
JWT_SECRET=your-strong-secret
CLIENT_URL=https://your-frontend-domain.com
```

---

## Notes

A few things worth mentioning:

- This project uses Prisma as the ORM layer for MySQL
- State management on the frontend is handled with Zustand
- Form validation is done using React Hook Form and Zod
- Protected routes are handled with JWT authentication
- The current structure is a good base if you want to add comments, labels, assignees, file attachments, or team support later

---

## Future improvements

Some useful next steps for this project could be:

- Add role-based access control
- Add comments for each issue
- Add issue assignment to users
- Add activity history or audit logs
- Add email notifications
- Add file attachments
- Add team or workspace support

---

## Author

Built as a full-stack issue tracker project using React, TypeScript, Express, Prisma, and MySQL.
