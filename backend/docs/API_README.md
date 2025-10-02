# FinWise API Reference

## Authentication

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Expenses

### Create Expense
```bash
curl -X POST http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.99,
    "category": "Food & Dining",
    "merchant": "McDonalds",
    "date": "2023-01-15T14:30:00Z",
    "note": "Lunch with colleagues"
  }'
```

### Get Expenses
```bash
curl -X GET http://localhost:3000/api/v1/expenses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Users

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Seeding

### Run Seed Script
```bash
cd backend && npm run seed
```