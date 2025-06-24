# Bank Transaction App

A simple full stack application for simulating and processing financial transactions. The project includes a React frontend and a Nest.js backend, using PostgreSQL and TypeORM for data management.

---

## Features

- Multiple persons can send transactions to a single bank
- Real-time bank balance display (with polling)
- Transaction history and status
- Batch processing time measurement
- Clean and straightforward user interface

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Docker & Docker Compose (for containerized setup)

### Docker Compose Setup

You can run the entire stack (frontend, backend, and database) using Docker Compose:

```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)
- PostgreSQL: localhost:5432

---

### Local Setup

#### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```
- Make sure PostgreSQL is running locally (default: `localhost:5432`).
- You can configure DB settings via environment variables or a `.env` file.

#### 2. Frontend
```bash
cd frontend
npm install
npm start
```
- The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Backend example (`.env`):
```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=bankapp
DB_PASSWORD=bankapppassword
DB_DATABASE=bankapp
```

---

## Design Notes

- **Backend:** Built with Nest.js and TypeORM. Uses database transactions and pessimistic locking to ensure safe concurrent updates to the bank balance. Mock data for persons and the bank is initialized on first run.
- **Frontend:** Built with React. Uses axios for API calls and react-toastify for notifications. The UI is kept simple and functional, focusing on usability.
- **Polling:** The bank balance is updated every 3 seconds using polling. For a production system, a WebSocket connection would be a better choice for real-time updates.
- **Batch Time:** The time taken to process a batch of transactions is measured and displayed to the user.

---