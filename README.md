# Helpdesk & Complaint Ticket System (PS8)

MERN Stack Application for College Assignment 6.

## Project Structure

```
helpdesk-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── common/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── tickets/
│   │   │   └── admin/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   ├── authHandler.js
│   │   ├── allowRoles.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── Ticket.js
│   │   └── Comment.js
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Server Setup

1. Navigate to the server directory:
   ```bash
   cd helpdesk-system/server
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Configure the environment variables in `.env`:
   - `PORT`: Server port (default: `5001`)
   - `MONGO_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/helpdesk_db`)
   - `JWT_SECRET`: Secret key for signing JWT tokens
   - `CLIENT_URL`: Client application URL (default: `http://localhost:5173`)
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Client Setup

1. Navigate to the client directory:
   ```bash
   cd helpdesk-system/client
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Configure the environment variables in `.env`:
   - `VITE_API_URL`: Backend API URL (default: `http://localhost:5001/api`)
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## API Health Check

Verify backend operation:
```bash
GET http://localhost:5001/api/health
```
Response:
```json
{
  "status": "ok",
  "message": "Helpdesk API is healthy and operational",
  "timestamp": "2026-10-21T..."
}
```
