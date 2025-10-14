# CareerHub - Professional Mentorship Platform

A comprehensive platform connecting mentors and mentees for career growth and professional development.

## 🚀 Features

### For Mentees

- **Career Guidance**: Connect with experienced professionals
- **Resume Reviews**: Get expert feedback on your resume
- **Interview Prep**: Practice with mock interviews
- **LinkedIn Optimization**: Improve your LinkedIn profile
- **Session Booking**: Schedule 1-on-1 mentoring sessions

### For Mentors

- **Profile Verification**: Secure LinkedIn OAuth verification
- **Session Management**: Easy scheduling and session tracking
- **Earnings Tracking**: Monitor your mentoring income
- **Profile Management**: Showcase your expertise
- **Admin Dashboard**: Manage applications and verifications

### Core Features

- **Secure Authentication**: JWT-based authentication system
- **LinkedIn OAuth**: Direct LinkedIn profile verification
- **Advanced Search**: MongoDB Atlas Search with filters and autocomplete
- **File Upload**: Resume and document management with AWS S3
- **Real-time Updates**: Live session status and notifications
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose and Atlas Search
- **JWT** for authentication
- **AWS S3** for file storage
- **LinkedIn OAuth 2.0** for profile verification

### Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- AWS S3 bucket (for file uploads)
- LinkedIn Developer App (for OAuth)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd careerHub
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Follow the detailed setup guide in [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) to configure:

- MongoDB connection
- AWS S3 credentials
- LinkedIn OAuth credentials
- JWT secrets
- Frontend and backend URLs

### 4. LinkedIn OAuth Setup

1. Create a LinkedIn Developer App at [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Configure OAuth 2.0 redirect URLs
3. Get your Client ID and Client Secret
4. Add credentials to environment variables

See [LINKEDIN_OAUTH_INTEGRATION.md](./LINKEDIN_OAUTH_INTEGRATION.md) for detailed instructions.

### 5. MongoDB Atlas Search Setup

1. Create MongoDB Atlas Search indexes for your collections
2. Configure search mappings for mentors, users, and sessions
3. Test search functionality

See [MONGODB_ATLAS_SEARCH_SETUP.md](./MONGODB_ATLAS_SEARCH_SETUP.md) for detailed instructions.

## 🚀 Running the Application

### Development Mode

```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5050

### Production Deployment

1. **Backend**: Deploy to Render

   - Connect your GitHub repository
   - Set environment variables
   - Deploy

2. **Frontend**: Deploy to Vercel
   - Connect your GitHub repository
   - Set environment variables
   - Deploy

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Mentor Endpoints

- `POST /api/mentors/register` - Mentor application
- `GET /api/mentors` - Get all mentors
- `GET /api/mentors/:id` - Get mentor details
- `PUT /api/mentors/:id` - Update mentor profile

### LinkedIn OAuth Endpoints

- `GET /api/linkedin/auth-url/:userId` - Generate OAuth URL
- `GET /api/linkedin/callback` - Handle OAuth callback
- `GET /api/linkedin/status/:userId` - Get verification status

### Session Endpoints

- `POST /api/sessions` - Create session
- `GET /api/sessions` - Get user sessions
- `PUT /api/sessions/:id` - Update session

### Search Endpoints

- `GET /api/search/mentors` - Search mentors with filters
- `GET /api/search/users` - Search users (authenticated)
- `GET /api/search/sessions` - Search sessions (authenticated)
- `GET /api/search/suggestions` - Get search suggestions
- `GET /api/search/analytics` - Get search analytics
- `GET /api/search/global` - Global search across all content

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **LinkedIn OAuth**: Verified professional profiles
- **CSRF Protection**: State parameter validation
- **Input Validation**: Server-side validation for all inputs
- **Secure File Upload**: AWS S3 with proper permissions
- **Environment Variables**: Sensitive data protection

## 📁 Project Structure

```
careerHub/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration files
│   └── scripts/            # Utility scripts
├── src/                    # Frontend application
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   └── styles/            # CSS styles
├── docs/                  # Documentation
└── test-files/            # Test assets
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
npm test
```

## 📝 Migration from Phyllo to OAuth

If you're migrating from the previous Phyllo integration:

1. Run the migration script:

```bash
cd backend
node scripts/migrateToOAuth.js
```

2. Update your environment variables to use LinkedIn OAuth credentials
3. Remove Phyllo-related environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the documentation in the `docs/` folder
2. Review the troubleshooting sections in setup guides
3. Open an issue on GitHub
4. Contact the development team

## 🔄 Changelog

### v2.0.0 - LinkedIn OAuth Integration

- Migrated from Phyllo to LinkedIn OAuth
- Improved user experience with direct LinkedIn authentication
- Enhanced security with OAuth 2.0 flow
- Reduced external dependencies

### v1.0.0 - Initial Release

- Basic mentorship platform
- Phyllo LinkedIn verification
- Session management
- File upload functionality
