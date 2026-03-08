# QAcart Todo Application V2

A complete Todo application used for QAcart courses - built with Next.js 14, Tailwind CSS, and SQLite.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | SQLite + Prisma ORM |
| Authentication | JWT (JSON Web Tokens) |
| Validation | Zod |

---

## Running the Application

### Development
```bash
npm install
npm run dev
```
This command seeds the database with test data and starts the server.

### Default Test User
| Field | Value |
|-------|-------|
| Email | user@qacart.com |
| Password | SuperSecret#1 |

---

## API Endpoints

### Authentication (No token required)

#### Register User
`POST /api/v1/users/register`

| Field | Type | Validation |
|-------|------|------------|
| firstName | string | Min 2 chars |
| lastName | string | Min 2 chars |
| email | string | Valid email, min 7 chars, unique |
| password | string | Min 8 chars |

**Response (201):**
```json
{
  "access_token": "jwt-token",
  "userID": "user-id",
  "firstName": "Name"
}
```

#### Login User
`POST /api/v1/users/login`

| Field | Type | Validation |
|-------|------|------------|
| email | string | Valid email |
| password | string | Required |

**Response (200):**
```json
{
  "access_token": "jwt-token",
  "userID": "user-id",
  "firstName": "Name"
}
```

#### Student Login
`POST /api/v1/students/login`

Same as user login (exists for API testing purposes).

---

### Tasks (Token required)

**Header:** `Authorization: Bearer <access_token>`

#### Get All Tasks
`GET /api/v1/tasks`

Returns all tasks for authenticated user, sorted by newest first.

#### Create Task
`POST /api/v1/tasks`

| Field | Type | Validation |
|-------|------|------------|
| item | string | Min 3 chars |

**Response (201):**
```json
{
  "_id": "task-id",
  "item": "Task description",
  "isCompleted": false,
  "userID": "user-id",
  "createdAt": "2024-03-08T12:00:00.000Z"
}
```

#### Get Single Task
`GET /api/v1/tasks/:id`

#### Update Task
`PUT /api/v1/tasks/:id`

| Field | Type | Validation |
|-------|------|------------|
| item | string | Optional, min 3 chars |
| isCompleted | boolean | Optional |

#### Delete Task
`DELETE /api/v1/tasks/:id`

---

## Error Responses

| Status | Condition |
|--------|-----------|
| 400 | Validation error |
| 401 | Unauthorized / Invalid credentials |
| 404 | Resource not found |
| 500 | Server error |

**Format:**
```json
{
  "message": "Error description"
}
```

---

## Frontend Pages

### Login (`/login`)

| Element | data-testid |
|---------|-------------|
| Email input | `email` |
| Password input | `password` |
| Submit button | `submit` |
| Error alert | `error-alert` |
| Signup link | `signup` |

### Signup (`/signup`)

| Element | data-testid |
|---------|-------------|
| Header | `header` |
| First name input | `first-name` |
| Last name input | `last-name` |
| Email input | `email` |
| Password input | `password` |
| Confirm password input | `confirm-password` |
| Submit button | `submit` |
| Error message | `error` |
| Login link | `go-login` |

### Todo List (`/todo`)

| Element | data-testid |
|---------|-------------|
| Welcome header | `welcome` |
| Add task button | `add` |
| No todos message | `no-todos` |
| Pagination links | `data-test-id="pagination-link"` |

**Greeting Logic:**
| Time | Greeting |
|------|----------|
| 00:00 - 11:59 | Good Morning |
| 12:00 - 17:59 | Good Afternoon |
| 18:00 - 23:59 | Good Evening |

### New Todo (`/todo/new`)

| Element | data-testid |
|---------|-------------|
| Header | `header` |
| Sub-header | `sub-header` |
| Task input | `new-todo` |
| Submit button | `submit-newTask` |
| Error message | `error-message` |
| Back link | `back` |

---

## Components

### Todo Item

| Element | data-testid |
|---------|-------------|
| Container | `todo-item` |
| Checkbox | `complete-task` |
| Task text | `todo-text` |
| Delete button | `delete` |

**Visual States:**
| State | Background | Text |
|-------|------------|------|
| Incomplete | `#3f51b5` | Normal |
| Complete | `#214C61` | Strikethrough |

### Pagination
- 5 items per page
- `data-test-id="pagination-link"` on page buttons

---

## Business Rules

### User Management
- Email must be unique
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Cookies set on login: `access_token`, `userID`, `firstName`

### Task Management
- Users can only access their own tasks
- New tasks default to `isCompleted: false`
- Deleting a user cascades to delete all their tasks

### Protected Routes
- `/todo` - Requires authentication
- `/todo/new` - Requires authentication
- Unauthenticated users redirected to `/login`

---

## Database Schema

### User
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary Key |
| firstName | String | Required |
| lastName | String | Required |
| email | String | Required, Unique |
| password | String | Required (hashed) |
| createdAt | DateTime | Auto |

### Task
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | Primary Key |
| item | String | Required |
| isCompleted | Boolean | Default: false |
| userId | String | Foreign Key |
| createdAt | DateTime | Auto |

---

## Scripts

```bash
npm run dev          # Seed DB + start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
```
