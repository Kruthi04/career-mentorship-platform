# Email Setup Guide for Mentor Verification

## 🎯 **No-Reply Email Options**

### **Option 1: Gmail with App Password (Recommended for Development)**

1. **Create a Gmail account** (e.g., `careerhub.noreply@gmail.com`)
2. **Enable 2-Factor Authentication**
3. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
4. **Update your `.env` file**:
   ```env
   EMAIL_USER=careerhub.noreply@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   ```

### **Option 2: Custom Domain No-Reply (Production)**

1. **Set up email service** (SendGrid, AWS SES, Mailgun)
2. **Configure custom domain** (e.g., `no-reply@careerhub.com`)
3. **Update `.env` file**:
   ```env
   EMAIL_USER=no-reply@careerhub.com
   EMAIL_PASSWORD=your-service-password
   EMAIL_SERVICE=sendgrid  # or ses, mailgun, etc.
   ```

### **Option 3: Free Email Services**

#### **SendGrid (Free Tier: 100 emails/day)**

```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### **Mailgun (Free Tier: 5,000 emails/month)**

```env
EMAIL_SERVICE=mailgun
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASSWORD=your-mailgun-api-key
```

## 🚀 **Quick Setup for Testing**

### **Step 1: Create Gmail Account**

1. Go to [Gmail](https://gmail.com)
2. Create account: `careerhub.noreply@gmail.com`
3. Enable 2FA
4. Generate App Password

### **Step 2: Update Environment Variables**

Add to your `backend/.env` file:

```env
EMAIL_USER=careerhub.noreply@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
FRONTEND_URL=http://localhost:5173
```

### **Step 3: Test Email Sending**

```bash
# Restart backend
cd backend && npm start

# Test mentor application
curl -X POST http://localhost:5050/api/mentors/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Test User",
    "professionalTitle":"Senior Software Engineer",
    "location":"San Francisco, CA",
    "bio":"Experienced software engineer",
    "areasOfExpertise":["Software Development"],
    "skills":["React","Node.js"],
    "yearsOfExperience":5,
    "languagesSpoken":["English"],
    "linkedInUrl":"https://linkedin.com/in/testuser",
    "personalWebsite":"https://testuser.dev",
    "idVerification":"test-verification.pdf",
    "hourlyRate":100,
    "offerFreeIntro":true,
    "helpAreas":["Resume Review"],
    "sessionDuration":"60",
    "availability":"Weekdays 6-9 PM"
  }'
```

## 📧 **Email Templates**

### **Verification Email Template**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1e40af;">Welcome to CareerHub, {{mentorName}}!</h2>
  <p>
    Thank you for applying to become a mentor. To complete your verification,
    please click the button below:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <a
      href="{{verificationUrl}}"
      style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
    >
      Verify My Account
    </a>
  </div>

  <p>If the button doesn't work, copy this link: {{verificationUrl}}</p>
  <p>This link expires in 24 hours.</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
  <p style="color: #6b7280; font-size: 12px;">
    This is an automated email from CareerHub. Please do not reply. Contact us
    at support@careerhub.com for questions.
  </p>
</div>
```

## 🔧 **Advanced Configuration**

### **Multiple Email Services Support**

```javascript
// In mentorController.js
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || "gmail";

  switch (service) {
    case "sendgrid":
      return nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    case "mailgun":
      return nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    default: // gmail
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  }
};
```

## 🛡️ **Security Best Practices**

1. **Use App Passwords** (not regular passwords)
2. **Environment Variables** (never hardcode credentials)
3. **Rate Limiting** (prevent email abuse)
4. **Email Validation** (verify email format)
5. **Token Expiration** (24-hour tokens)

## 📊 **Monitoring & Analytics**

### **Email Delivery Tracking**

```javascript
// Add to mentorController.js
const trackEmailDelivery = async (email, mentorId, type) => {
  try {
    // Log email sent
    console.log(`Email sent: ${type} to ${email} for mentor ${mentorId}`);

    // You can add database logging here
    // await EmailLog.create({ email, mentorId, type, sentAt: new Date() });
  } catch (error) {
    console.error("Email tracking error:", error);
  }
};
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Invalid credentials"**

   - Check App Password is correct
   - Ensure 2FA is enabled

2. **"Authentication failed"**

   - Verify email address format
   - Check service configuration

3. **"Rate limit exceeded"**
   - Implement email queuing
   - Add delays between sends

### **Testing Commands**

```bash
# Test email configuration
curl -X POST http://localhost:5050/api/mentors/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","professionalTitle":"Engineer","location":"SF","bio":"Test","areasOfExpertise":["Tech"],"skills":["JS"],"yearsOfExperience":5,"languagesSpoken":["English"],"linkedInUrl":"https://linkedin.com/in/test","idVerification":"test.pdf","hourlyRate":100,"offerFreeIntro":true,"helpAreas":["Resume"],"sessionDuration":"60","availability":"Weekdays"}'

# Check email logs
tail -f backend/logs/app.log | grep "Email"
```

## 🎯 **Production Recommendations**

1. **Use SendGrid or AWS SES** for production
2. **Set up SPF/DKIM records** for better deliverability
3. **Implement email templates** with proper branding
4. **Add email analytics** and delivery tracking
5. **Set up email queuing** for high volume
6. **Configure bounce handling** and unsubscribe lists

---

**Next Steps:**

1. Choose your email service
2. Update `.env` file with credentials
3. Test email sending
4. Monitor delivery rates
5. Set up production email service
