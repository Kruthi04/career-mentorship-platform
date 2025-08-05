# Mentor Verification System Setup

This guide explains how to set up automatic mentor verification with LinkedIn verification and email verification.

## 🔧 **Features Implemented**

### **1. LinkedIn Verification**

- Validates LinkedIn URL format
- Extracts LinkedIn username
- Basic format validation (can be enhanced with LinkedIn API)

### **2. Email Verification**

- Sends verification emails with secure tokens
- 24-hour token expiration
- Automatic mentor activation upon verification
- Resend verification email functionality

## 📋 **Setup Instructions**

### **1. Environment Variables**

Add these to your `.env` file:

```env
# Email Configuration (Gmail recommended)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (for email verification links)
FRONTEND_URL=http://localhost:3000
```

### **2. Gmail App Password Setup**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use the generated password** in `EMAIL_PASSWORD`

### **3. LinkedIn API (Optional Enhancement)**

For more robust LinkedIn verification, you can integrate the LinkedIn API:

```javascript
// Enhanced LinkedIn verification
const verifyLinkedInProfile = async (linkedInUrl) => {
  try {
    // Use LinkedIn API to verify profile exists
    const response = await fetch(
      `https://api.linkedin.com/v2/people/${linkedInUsername}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        },
      }
    );

    return {
      isValid: response.ok,
      reason: response.ok
        ? "LinkedIn profile verified"
        : "LinkedIn profile not found",
    };
  } catch (error) {
    return { isValid: false, reason: "LinkedIn API error" };
  }
};
```

## 🚀 **How It Works**

### **1. Mentor Application Process**

1. **User applies** to become a mentor
2. **LinkedIn URL** is validated immediately
3. **Verification token** is generated
4. **Verification email** is sent to user's email
5. **Mentor status** remains "pending" until email verification

### **2. Email Verification Process**

1. **User clicks** verification link in email
2. **Token is validated** on the backend
3. **Mentor status** is updated to "verified"
4. **User is redirected** to dashboard

### **3. Verification Status**

Mentors have multiple verification flags:

- `verified`: Overall verification status
- `linkedInVerified`: LinkedIn profile verified
- `emailVerified`: Email address verified

## 📝 **API Endpoints**

### **Apply to Become Mentor**

```http
POST /api/mentors/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "professionalTitle": "Senior Software Engineer",
  "linkedInUrl": "https://linkedin.com/in/johndoe",
  // ... other mentor fields
}
```

### **Verify Email**

```http
GET /api/mentors/verify-email/:token
```

### **Resend Verification Email**

```http
POST /api/mentors/resend-verification/:mentorId
Authorization: Bearer <token>
```

## 🎯 **Frontend Integration**

### **Email Verification Page**

- Route: `/verify-email?token=<token>`
- Component: `EmailVerification.tsx`
- Handles verification automatically
- Shows success/error states

### **Mentor Application Form**

- Integrates with new verification system
- Shows LinkedIn validation feedback
- Handles email verification flow

## 🔒 **Security Features**

### **Token Security**

- 32-byte random tokens
- 24-hour expiration
- Single-use tokens (deleted after verification)

### **Email Security**

- HTML email templates
- Secure verification links
- Professional branding

## 🧪 **Testing**

### **Test LinkedIn Verification**

```bash
curl -X POST http://localhost:5050/api/mentors/apply \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "linkedInUrl": "https://linkedin.com/in/testuser",
    "professionalTitle": "Test Engineer"
  }'
```

### **Test Email Verification**

1. Apply as mentor
2. Check email for verification link
3. Click link to verify
4. Check mentor status in database

## 🚨 **Troubleshooting**

### **Email Not Sending**

1. Check Gmail app password
2. Verify EMAIL_USER and EMAIL_PASSWORD
3. Check Gmail security settings

### **LinkedIn Verification Failing**

1. Ensure LinkedIn URL format is correct
2. Check if LinkedIn profile is public
3. Verify username extraction logic

### **Token Expired**

1. Use resend verification endpoint
2. Check token expiration logic
3. Verify timezone settings

## 🔄 **Future Enhancements**

1. **LinkedIn API Integration** for deeper verification
2. **SMS Verification** as backup
3. **Document Verification** (ID, certificates)
4. **Social Media Verification** (Twitter, GitHub)
5. **Background Check Integration**
6. **Video Call Verification**

## 📞 **Support**

For issues with the verification system:

1. Check server logs for errors
2. Verify environment variables
3. Test email configuration
4. Review LinkedIn URL format
