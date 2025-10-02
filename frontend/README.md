# FinWise Frontend

A modern financial literacy platform built with React, Vite, and Tailwind CSS.

## Features

- Responsive design with mobile-first approach
- Authentication system (login, register, password reset)
- Dashboard with financial overview
- Protected routes and role-based access control
- Modern UI with gradients, shadows, and smooth transitions
- Form validation and error handling
- Token-based authentication with automatic refresh

## Prerequisites

- Node.js >= 18
- npm or yarn

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the frontend root directory:
   ```env
   VITE_API_URL=http://localhost:3000/api/v1
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs ESLint
- `npm run lint:fix` - Runs ESLint and fixes auto-fixable issues

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── layouts/        # Page layouts
├── pages/          # Page components
├── utils/          # Utility functions
├── App.jsx         # Main app component
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## Development

The frontend development server runs on port 5173 by default. The backend API is expected to be running on port 3000.

To change the API URL, update the `VITE_API_URL` in your `.env` file.