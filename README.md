# Task Manager (Spring Boot + React)

A full-stack Task Manager application with:

- Backend: Spring Boot, Spring Data JPA, PostgreSQL (and optional H2), Java 21
- Frontend: React + TypeScript + Vite
- Features: Create, edit, delete, filter, search, and sort tasks by due date

## Project Structure

- `backend/taskmanager` - Spring Boot REST API
- `frontend` - React client app

## Tech Stack

### Backend

- Java 21
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- PostgreSQL driver
- H2 (runtime dependency available)
- Lombok

### Frontend

- React 19
- TypeScript
- Vite
- Axios

## Prerequisites

- Java 21+
- Node.js 18+ (or newer LTS)
- npm
- PostgreSQL running locally on port `5432`

## Database Configuration

Backend config is in:

- `backend/taskmanager/src/main/resources/application.properties`

Current settings use PostgreSQL:

- URL: `jdbc:postgresql://localhost:5432/taskmanager`
- Username: `task_user`
- Password: `task_password`

Create the DB and user (example):

```sql
CREATE DATABASE taskmanager;
CREATE USER task_user WITH PASSWORD 'task_password';
GRANT ALL PRIVILEGES ON DATABASE taskmanager TO task_user;
```

If you want to use different credentials, update `application.properties`.

## Run the Backend

From `backend/taskmanager`:

```bash
./mvnw spring-boot:run
```

Backend starts at:

- `http://localhost:8080`

## Run the Frontend

From `frontend`:

```bash
npm install
npm run dev
```

Frontend starts at:

- `http://localhost:5173`

## API Overview

Base URL:

- `http://localhost:8080/api/tasks`

Endpoints:

- `GET /api/tasks` - list all tasks
- `GET /api/tasks/{id}` - get one task
- `POST /api/tasks` - create task
- `PUT /api/tasks/{id}` - update task
- `DELETE /api/tasks/{id}` - delete task

### Task Status Values

- `TODO`
- `IN_PROGRESS`
- `DONE`

## CORS

Backend currently allows requests from:

- `http://localhost:5173`

This is configured in `TaskController`.

## Build Commands

### Backend

```bash
./mvnw test
./mvnw package
```

### Frontend

```bash
npm run lint
npm run build
npm run preview
```

## Common Troubleshooting

- Frontend cannot reach backend: confirm backend is running on `8080`.
- DB connection failed: verify PostgreSQL is running and credentials match `application.properties`.
- CORS errors: make sure frontend runs on `5173` or update allowed origin in backend.
