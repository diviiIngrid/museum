# Museum Website

A modern museum website with React frontend and Express backend connected to a PostgreSQL database. This project allows museums to showcase their exhibitions and visitors to book tickets online.

## Features

- Responsive design for all devices
- Exhibition browsing and detailed view
- Online ticket reservation system
- User registration and profiles
- Admin dashboard for managing exhibitions and reservations
- PostgreSQL database for data storage

## Tech Stack

- **Frontend**: React, React Router, Styled Components, Formik + Yup
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

### Installation

1. Clone the repository
2. Install root dependencies:
   ```
   npm install
   ```

3. Install client and server dependencies:
   ```
   npm run install-all
   ```

4. Create a PostgreSQL database named 'museum'

5. Configure environment variables:
   - Create a `.env` file in the server directory based on the `.env` example

6. Initialize the database:
   ```
   cd server
   npm run init-db
   ```

7. Start the development server:
   ```
   npm start
   ```

8. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Admin Account

- Email: admin@museum.com
- Password: admin123

## Project Structure

```
museum-website/
├── client/                  # React frontend
│   ├── public/              # Public assets
│   └── src/                 # React source files
│       ├── components/      # Reusable components
│       ├── context/         # React context providers
│       ├── http/            # API communication
│       └── pages/           # Page components
├── server/                  # Express backend
│   ├── controllers/         # Request controllers
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── index.js             # Server entry point
│   └── db.js                # Database connection
└── package.json             # Root package.json
```

## API Documentation

The API provides endpoints for:

- User authentication and profile management
- Exhibition CRUD operations
- Reservation creation and management

## License

This project is licensed under the MIT License.
  