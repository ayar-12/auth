# Auth Frontend Starter

A production-ready authentication frontend built with React and Redux Toolkit, providing a robust foundation for user authentication flows in modern web applications.

## Overview

This starter template provides a complete authentication UI implementation with state management, form validation, and API integration patterns. It's designed to accelerate development by offering pre-built login and registration interfaces that can be easily customized to match your brand and backend requirements.

## Features

- **Complete Authentication Flow**: Login, registration, and session management
- **Redux Toolkit Integration**: Centralized state management with RTK Query for efficient API caching
- **Form Validation**: Client-side validation with real-time feedback
- **Password Security**: Password strength indicator and visibility toggle
- **Token Management**: JWT-based authentication with automatic token refresh
- **User Feedback**: Error handling and success notifications
- **Responsive Design**: Mobile-first approach with full responsive layout
- **Theme Customization**: Easy brand customization (logo, colors, typography)
- **Type Safety**: PropTypes validation for component props

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18+** | UI library with hooks and modern patterns |
| **Redux Toolkit** | State management and API integration |
| **RTK Query** | Data fetching and caching layer |
| **Material UI (MUI)** | Component library and design system |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **Vite** | Build tool and development server |

## Prerequisites

- Node.js 16+ and npm/yarn
- A backend API server (see [Backend Requirements](#backend-requirements))

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd auth-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Edit the `.env` file and set your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173` (default Vite port).

## Backend Requirements

This frontend starter requires a REST API backend with the following endpoints:

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/auth/register` | POST | Create new user account | `{ email, password, name }` | `{ user, accessToken, refreshToken }` |
| `/auth/login` | POST | Authenticate user | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| `/auth/refresh` | POST | Refresh expired access token | `{ refreshToken }` | `{ accessToken }` |
| `/users/me` | GET | Get authenticated user profile | Headers: `Authorization: Bearer <token>` | `{ user }` |

### Expected Response Format

All responses should follow this structure:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Project Structure

```
auth-frontend/
├── src/
│   ├── assets/           # Static assets (logo, images)
│   ├── components/       # Reusable UI components
│   ├── config/          # Configuration files (brand settings)
│   ├── features/        # Redux slices and API definitions
│   │   ├── auth/        # Authentication slice (authApi, userSlice)
│   │   └── user/        # User management
│   ├── pages/           # Page components (Login, Register)
│   ├── theme/           # MUI theme configuration
│   ├── utils/           # Helper functions and validators
│   ├── App.jsx          # Root component
│   └── main.jsx         # Application entry point
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Customization Guide

### Branding

| Task | File Path | Description |
|------|-----------|-------------|
| **Logo** | `src/assets/logo.*` | Replace with your brand logo (SVG/PNG) |
| **App Name** | `src/config/brand.js` | Update application name and metadata |
| **Primary Colors** | `src/theme/index.js` | Modify color palette (primary, secondary) |
| **Typography** | `src/theme/typography.js` | Customize fonts and text styles |
| **API URL** | `.env` | Set backend base URL |

### Example: Updating Theme Colors

Edit `src/theme/index.js`:

```javascript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your brand color
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## Redux Store Architecture

### State Structure

```javascript
{
  auth: {
    user: null | { id, email, name, ... },
    accessToken: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean
  },
  api: {
    queries: { /* RTK Query cache */ },
    mutations: { /* API mutation state */ }
  }
}
```

### Key Files

- **`src/features/auth/authApi.js`**: RTK Query API definitions
- **`src/features/auth/userSlice.js`**: Authentication state slice
- **`src/store/store.js`**: Redux store configuration

## Security Considerations

- Tokens are stored in Redux state (consider adding `redux-persist` with encryption for production)
- Passwords are never stored client-side
- API requests use Bearer token authentication
- Implement HTTPS in production
- Consider adding CSRF protection
- Add rate limiting on backend endpoints

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Set up environment**: Configure `.env` file
3. **Start development server**: `npm run dev`
4. **Customize branding**: Update logo, colors, and app name
5. **Connect to backend**: Ensure API endpoints match your backend
6. **Test authentication flow**: Register → Login → Protected routes

## Deployment

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Environment Variables

Ensure the following environment variables are set in your deployment platform:

- `VITE_API_BASE_URL`: Your production API URL

### Recommended Hosting Platforms

- **Vercel** (recommended for Vite projects)
- **Netlify**
- **AWS S3 + CloudFront**
- **Digital Ocean App Platform**

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact the maintainers.

## Acknowledgments

Built with modern React patterns and best practices for authentication flows. Inspired by real-world production applications.

---

**Note**: This is a frontend-only starter. You must implement your own backend API to handle authentication logic, database operations, and token management.
