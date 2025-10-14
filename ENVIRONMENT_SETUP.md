# Environment Setup Guide

## Frontend Environment Variables

### 1. Local Development (.env file)

Create a `.env` file in your frontend root directory:

```env
VITE_API_BASE_URL=http://localhost:5050/api
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin-callback
```

### 2. Production (Vercel)

In your Vercel dashboard, set the environment variables:

**Variable Name:** `VITE_API_BASE_URL`
**Value:** `https://your-render-app.onrender.com/api`

**Variable Name:** `VITE_LINKEDIN_CLIENT_ID`
**Value:** `your-linkedin-client-id`

**Variable Name:** `VITE_LINKEDIN_REDIRECT_URI`
**Value:** `https://your-vercel-app.vercel.app/linkedin-callback`

Replace `your-render-app.onrender.com` with your actual Render domain and `your-vercel-app.vercel.app` with your actual Vercel domain.

## Backend Environment Variables (Render)

Set these in your Render dashboard:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-2
FRONTEND_URL=https://your-vercel-app.vercel.app

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=https://your-vercel-app.vercel.app/linkedin-callback
```

## LinkedIn OAuth Setup

### 1. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in the required information
4. Add OAuth 2.0 redirect URLs:
   - Development: `http://localhost:5173/linkedin-callback`
   - Production: `https://your-vercel-app.vercel.app/linkedin-callback`

### 2. Get OAuth Credentials

1. In your LinkedIn app dashboard, go to "Auth" tab
2. Copy your Client ID and Client Secret
3. Add these to your environment variables

### 3. Configure Permissions

Ensure your LinkedIn app has the following permissions:
- `r_liteprofile` - Read basic profile information
- `r_emailaddress` - Read email address

## Testing the Connection

1. **Deploy your backend** to Render
2. **Set the frontend environment variables** in Vercel with your Render URL and LinkedIn credentials
3. **Redeploy your frontend** to Vercel
4. **Check the sign-in page** - it should show "Backend connection successful"
5. **Test LinkedIn OAuth** by trying to register as a mentor with LinkedIn verification

## Troubleshooting

### If you see "Cannot connect to server":

1. **Check your Render URL** - make sure it's correct and ends with `/api`
2. **Verify the environment variable** is set correctly in Vercel
3. **Check Render logs** to ensure your backend is running
4. **Test the Render URL directly** in your browser

### If you see CORS errors:

1. **Update your backend CORS configuration** to include your Vercel domain
2. **Redeploy your backend** after making CORS changes

### Example Render URL format:

```
https://your-app-name.onrender.com/api
```

Make sure to include `/api` at the end when setting the `VITE_API_BASE_URL` variable.
