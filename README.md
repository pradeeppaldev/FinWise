# FinWise — Financial literacy + behavior change platform

This is a monorepo containing both the backend and frontend for the FinWise platform.

## Project Structure

- `/backend` - Node.js + Express backend with MongoDB
- `/frontend` - React + Vite frontend with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies in both directories:
   ```bash
   cd backend && npm install
   cd frontend && npm install
   ```
3. Create `.env` files in both directories based on `.env.example`
4. Run both services:
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

## Scripts

- `npm run dev` - Run in development mode
- `npm run start` - Run in production mode