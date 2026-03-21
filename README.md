# Vehicle Rental System - Frontend

A modern Next.js frontend application for the Vehicle Rental System backend.

## Features

- **User Authentication**: Login and registration with JWT token-based authentication
- **Profile Management**: View and update user profile information
- **Rental History**: Track and view complete rental history
- **Responsive Design**: Mobile-friendly interface with dark mode support
- **Modern UI**: Beautiful gradient designs with smooth animations
- **Secure**: Protected routes and secure API communication

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **HTTP Client**: Axios
- **Authentication**: JWT with jwt-decode

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Customer Service backend running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env.local` file is already configured:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Pages

- **/** - Landing page with vehicle rental features
- **/login** - User login page
- **/register** - New user registration
- **/home** - Dashboard with rental history (protected)
- **/profile** - User profile management (protected)

## Features Overview

### Landing Page
- Eye-catching hero section with gradient design
- Feature highlights
- Call-to-action buttons
- Animated background elements

### Authentication
- Secure login and registration
- JWT token-based authentication
- Automatic token refresh
- Protected route handling

### Dashboard
- View rental statistics
- Complete rental history table
- Account status overview
- Beautiful gradient cards

### Profile Management
- Edit personal information
- View account details
- Update contact information
- Account deletion option

## API Integration

The frontend connects to the Customer Service backend:

- `POST /customers/register` - Register new user
- `POST /customers/login` - User login
- `GET /customers/{id}` - Get user profile
- `PUT /customers/{id}` - Update user profile
- `DELETE /customers/{id}` - Delete user account
- `GET /customers/{id}/history` - Get rental history

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── home/          # Dashboard page
│   │   ├── login/         # Login page
│   │   ├── profile/       # Profile page
│   │   ├── register/      # Registration page
│   │   ├── globals.css    # Global styles with animations
│   │   ├── layout.tsx     # Root layout with AuthProvider
│   │   └── page.tsx       # Landing page
│   ├── components/
│   │   └── Navbar.tsx     # Navigation component
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   └── services/
│       └── customerService.ts # API service layer
├── .env.local             # Environment variables
└── package.json
```

## Design Features

- **Gradient Backgrounds**: Modern gradient designs throughout
- **Smooth Animations**: Blob animations on landing page
- **Dark Mode**: Full dark mode support
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG compliant color contrasts

## Building for Production

```bash
npm run build
npm start
```

## Development

```bash
npm run dev    # Start development server
npm run lint   # Run ESLint
```

## Notes

- Backend must be running on port 8080
- JWT tokens stored in localStorage
- Protected routes redirect to login
- Automatic token validation on page load
