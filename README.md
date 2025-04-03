# Codemap API

A Node.js REST API with MongoDB and JWT authentication.

## Features

- User registration and authentication
- JWT-based authentication
- Input validation
- Error handling
- MongoDB integration
- Standardized API responses

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Omar-Einstein7/codemapAPI.git
cd codemapAPI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "Test123456"
}
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Username Requirements

- 3-20 characters
- Alphanumeric and underscores only

## Error Handling

The API uses standardized error responses with appropriate HTTP status codes and messages.

## License

ISC 