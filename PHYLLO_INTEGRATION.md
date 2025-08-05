# Phyllo LinkedIn Verification Integration

This document describes the integration of Phyllo for LinkedIn verification in the CareerHub application.

## Overview

Phyllo is a data connectivity platform that provides secure, reliable LinkedIn profile verification. This integration replaces the previous OAuth-based LinkedIn verification with a more robust solution.

## Features

- **Secure Verification**: Uses Phyllo's enterprise-grade API for LinkedIn profile verification
- **Real-time Status**: Check verification status in real-time
- **Webhook Support**: Receive automatic updates when verification status changes
- **Profile Data**: Access verified LinkedIn profile information
- **Manual Verification**: Support for manual verification with company/position matching

## Setup

### 1. Phyllo Account Setup

1. Sign up for a Phyllo account at [https://getphyllo.com](https://getphyllo.com)
2. Create a new application in the Phyllo dashboard
3. Get your API credentials:
   - Client ID
   - Client Secret
   - Webhook Secret

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Phyllo Configuration
PHYLLO_BASE_URL=https://api.getphyllo.com
PHYLLO_CLIENT_ID=your-phyllo-client-id
PHYLLO_CLIENT_SECRET=your-phyllo-client-secret
PHYLLO_WEBHOOK_SECRET=your-phyllo-webhook-secret
```

### 3. Webhook Configuration

Configure your Phyllo webhook URL in the Phyllo dashboard:

```
https://your-domain.com/api/phyllo/webhook
```

## API Endpoints

### Initialize LinkedIn Verification

```
POST /api/phyllo/linkedin/initiate
```

**Request Body:**

```json
{
  "userId": "user_id",
  "linkedInUrl": "https://linkedin.com/in/username",
  "userData": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Check Verification Status

```
GET /api/phyllo/linkedin/status/:userId
```

### Manual Verification

```
POST /api/phyllo/linkedin/verify/:userId
```

**Request Body:**

```json
{
  "linkedInUrl": "https://linkedin.com/in/username",
  "company": "Company Name",
  "position": "Job Title"
}
```

### Webhook Handler

```
POST /api/phyllo/webhook
```

## Verification Status

- `not_initiated`: Verification has not been started
- `pending`: Verification is in progress
- `connected`: LinkedIn profile is connected
- `verified`: Profile has been successfully verified
- `failed`: Verification failed
- `disconnected`: LinkedIn connection was lost

## Frontend Integration

### Signup Flow

1. User selects "Become a Mentor" or "Both"
2. User checks "Verify my LinkedIn profile"
3. User provides LinkedIn URL
4. On form submission, Phyllo verification is initiated
5. User receives confirmation and status updates

### Dashboard Integration

The `LinkedInVerificationStatus` component displays:

- Current verification status
- Profile information (when verified)
- LinkedIn URL
- Refresh button for status updates

## Security

- All API requests are signed with HMAC-SHA256
- Webhook signatures are verified
- User authentication required for all endpoints
- LinkedIn URLs are validated before processing

## Error Handling

Common error scenarios:

- Invalid LinkedIn URL format
- Network connectivity issues
- Phyllo API rate limits
- Webhook signature verification failures

## Testing

### Manual Testing

1. Create a test user account
2. Initiate LinkedIn verification
3. Check status endpoint
4. Verify webhook handling

### Integration Testing

1. Test with real LinkedIn profiles
2. Verify webhook callbacks
3. Test error scenarios
4. Validate profile data extraction

## Migration from OAuth

The previous OAuth-based LinkedIn verification has been replaced with Phyllo. Key differences:

- **More Reliable**: Phyllo provides enterprise-grade reliability
- **Better Data**: Access to verified profile information
- **Real-time Updates**: Webhook-based status updates
- **Manual Verification**: Support for manual verification process

## Troubleshooting

### Common Issues

1. **Verification Not Starting**

   - Check Phyllo credentials
   - Verify LinkedIn URL format
   - Check network connectivity

2. **Status Not Updating**

   - Verify webhook configuration
   - Check webhook signature verification
   - Review server logs

3. **Profile Data Missing**
   - Ensure account is connected
   - Check Phyllo API permissions
   - Verify profile is public

### Debug Logs

Enable debug logging by checking server console output for:

- Phyllo API requests/responses
- Webhook events
- Verification status changes
- Error messages

## Support

For issues with Phyllo integration:

1. Check Phyllo documentation
2. Review server logs
3. Verify environment variables
4. Test with Phyllo sandbox environment
