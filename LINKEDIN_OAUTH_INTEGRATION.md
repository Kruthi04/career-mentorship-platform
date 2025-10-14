# LinkedIn OAuth Integration

This document describes the integration of LinkedIn OAuth for profile verification in the CareerHub application.

## Overview

LinkedIn OAuth provides a secure, user-friendly way to verify LinkedIn profiles. Users can authenticate directly with LinkedIn and grant permission to access their profile information.

## Features

- **Secure Authentication**: Uses LinkedIn's official OAuth 2.0 flow
- **User-Friendly**: Direct authentication with LinkedIn
- **Profile Data Access**: Retrieve verified LinkedIn profile information
- **Token Management**: Automatic token refresh and expiration handling
- **Real-time Verification**: Immediate verification upon successful authentication

## Setup

### 1. LinkedIn App Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure OAuth 2.0 settings:
   - Add redirect URLs: `http://localhost:5173/linkedin-callback` (development)
   - Add redirect URLs: `https://your-domain.com/linkedin-callback` (production)
4. Get your OAuth credentials:
   - Client ID
   - Client Secret

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin-callback
```

### 3. Frontend Configuration

Update your frontend environment variables:

```env
# Frontend LinkedIn OAuth
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin-callback
```

## API Endpoints

### Generate LinkedIn OAuth URL

```
GET /api/linkedin/auth-url/:userId
```

**Response:**

```json
{
  "authUrl": "https://www.linkedin.com/oauth/v2/authorization?..."
}
```

### Handle OAuth Callback

```
GET /api/linkedin/callback?code=...&state=...
```

**Response:**

```json
{
  "message": "LinkedIn verification completed successfully",
  "verified": true,
  "profile": {
    "headline": "Software Engineer at Company",
    "company": "Company Name",
    "position": "Software Engineer"
  }
}
```

### Get LinkedIn Verification Status

```
GET /api/linkedin/status/:userId
```

**Response:**

```json
{
  "hasLinkedInProfile": true,
  "verified": true,
  "profile": {
    "linkedInId": "user_id",
    "headline": "Software Engineer at Company",
    "company": "Company Name",
    "position": "Software Engineer",
    "profileUrl": "https://www.linkedin.com/in/username",
    "verified": true,
    "verificationDate": "2024-01-01T00:00:00.000Z"
  }
}
```

## OAuth Flow

### 1. User Registration/Signup

1. User fills out mentor application form
2. User checks "Verify my LinkedIn profile"
3. On form submission, OAuth URL is generated
4. User is redirected to LinkedIn OAuth

### 2. LinkedIn Authentication

1. User is redirected to LinkedIn
2. User logs in and grants permissions
3. LinkedIn redirects back to callback URL with authorization code

### 3. Profile Verification

1. Backend exchanges code for access token
2. Backend retrieves user profile from LinkedIn API
3. Profile information is stored and user is marked as verified
4. User is redirected to success page

## Frontend Integration

### Signup Flow

The `MentorSignUp` component handles LinkedIn OAuth initiation:

```typescript
const initiateLinkedInVerification = async (userId: string) => {
  const response = await fetch(`/api/linkedin/auth-url/${userId}`);
  const data = await response.json();

  if (response.ok) {
    window.location.href = data.authUrl;
  }
};
```

### Callback Handling

The `LinkedInCallback` component processes the OAuth callback:

```typescript
const handleCallback = async () => {
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const response = await fetch(
    `/api/linkedin/callback?code=${code}&state=${state}`
  );
  const data = await response.json();

  if (response.ok) {
    // Handle successful verification
  }
};
```

### Status Display

The `LinkedInVerificationStatus` component shows verification status:

```typescript
const checkStatus = async () => {
  const response = await fetch(`/api/linkedin/status/${userId}`);
  const data = await response.json();

  if (response.ok) {
    setStatus(data.verified ? "verified" : "not_initiated");
    setProfileData(data.profile);
  }
};
```

## Security

- **State Parameter**: CSRF protection using state parameter
- **Token Storage**: Access tokens stored securely in database
- **Token Expiration**: Automatic handling of token expiration
- **User Authentication**: All endpoints require user authentication
- **Scope Limitation**: Minimal required permissions (r_liteprofile, r_emailaddress)

## Error Handling

Common error scenarios:

- Invalid authorization code
- Expired authorization code
- Network connectivity issues
- LinkedIn API rate limits
- Invalid redirect URI

## Token Management

### Access Token Storage

Access tokens are stored in the user's `linkedInProfile` object:

```javascript
linkedInProfile: {
  accessToken: "access_token_here",
  refreshToken: "refresh_token_here",
  tokenExpiry: "2024-01-01T00:00:00.000Z",
  // ... other fields
}
```

### Token Refresh

When tokens expire, users need to re-authenticate with LinkedIn. The system will:

1. Detect expired tokens
2. Mark verification status as "expired"
3. Prompt user to re-authenticate

## Testing

### Manual Testing

1. Create a test user account
2. Initiate LinkedIn OAuth flow
3. Complete LinkedIn authentication
4. Verify callback handling
5. Check verification status

### Integration Testing

1. Test with real LinkedIn accounts
2. Verify profile data extraction
3. Test error scenarios
4. Validate token management

## Migration from Phyllo

The system has been migrated from Phyllo to LinkedIn OAuth. Key differences:

- **Simpler Setup**: No third-party service required
- **Direct Authentication**: Users authenticate directly with LinkedIn
- **Better UX**: Familiar OAuth flow for users
- **Reduced Dependencies**: No external API dependencies
- **Cost Effective**: No per-verification costs

## Troubleshooting

### Common Issues

1. **OAuth URL Generation Fails**

   - Check LinkedIn app configuration
   - Verify environment variables
   - Ensure redirect URI is configured

2. **Callback Processing Fails**

   - Check authorization code validity
   - Verify client secret
   - Check network connectivity

3. **Profile Data Missing**
   - Ensure user granted required permissions
   - Check LinkedIn API permissions
   - Verify profile is public

### Debug Logs

Enable debug logging by checking server console output for:

- OAuth URL generation
- Callback processing
- LinkedIn API requests/responses
- Token management
- Error messages

## Support

For issues with LinkedIn OAuth integration:

1. Check LinkedIn Developer documentation
2. Review server logs
3. Verify environment variables
4. Test with LinkedIn sandbox environment
5. Check LinkedIn app configuration
