# Orufy Assignment – Full Stack Developer

A full-stack e-commerce product management application built with modern web technologies.

## Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB

## Project Structure

```
Orufy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── api/           # API calls (axios)
│   │   └── assets/        # Images and static files
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middlewares
│   │   └── config/        # Database config
│   └── package.json
└── README.md
```

## Features

- **Authentication**: OTP-based login and signup
- **Product Management**: Create, read, update, delete products
- **Product Catalog**: Browse and search products
- **Publish/Unpublish**: Toggle product visibility
- **Image Upload**: Support for multiple product images
- **Responsive Design**: Mobile, tablet, and desktop views

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend will run on `http://localhost:3456`

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3456
```

Create a `.env` file in the client directory (or use `.env.local`):

```
VITE_API_URL=http://localhost:3456
```

## API Endpoints

### Authentication

- `POST /auth/send-otp` - Send OTP to email/phone
- `POST /auth/verify-otp` - Verify OTP and login

### Products

- `GET /products` - Get all products
- `POST /products/create` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `PATCH /products/:id/status` - Toggle publish status

## Key Components

### Frontend

- **Login.jsx** - OTP-based authentication (login & signup)
- **Products.jsx** - Product listing and management
- **ProductCard.jsx** - Individual product display
- **AddProductModal.jsx** - Add product form
- **EditProductModal.jsx** - Edit product form
- **Header.jsx** - Top navigation with user profile
- **Sidebar.jsx** - Side navigation menu
- **AuthContext.jsx** - User authentication state management

### Backend

- **auth.controller.js** - Authentication logic
- **product.controller.js** - Product CRUD operations
- **auth.middleware.js** - JWT verification
- **multer.js** - Image upload handling

## Live URLs

- **Frontend**: https://...
- **Backend**: https://...

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run both servers
5. Open `http://localhost:5173` in your browser

## Notes

- Images are uploaded to the `server/uploads/` directory
- OTP verification is used for authentication (no password required)
- Users can provide either email or phone for signup/login
- Products support multiple images with carousel navigation
