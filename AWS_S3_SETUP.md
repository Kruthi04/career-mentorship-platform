# AWS S3 Setup Guide for CareerHub

## 🔐 Secure S3 Configuration

This guide will help you set up AWS S3 for storing profile pictures and documents securely without making the bucket public.

## 📋 Prerequisites

1. AWS Account
2. AWS CLI installed (optional but recommended)
3. Node.js backend running

## 🚀 Step-by-Step Setup

### 1. Create S3 Bucket

1. **Go to AWS S3 Console**

   - Navigate to https://console.aws.amazon.com/s3/
   - Click "Create bucket"

2. **Configure Bucket**

   ```
   Bucket name: careerhub-files-[your-unique-id]
   Region: us-east-1 (or your preferred region)
   ```

3. **Block Public Access Settings**

   - ✅ Block all public access
   - ✅ Block public access through bucket policies
   - ✅ Block public access through ACLs
   - ✅ Block public access through any access control lists

4. **Advanced Settings**
   - Versioning: Disabled (for simplicity)
   - Tags: Add tags for organization
   - Default encryption: Enabled (SSE-S3)

### 2. Create IAM User for Application

1. **Go to IAM Console**

   - Navigate to https://console.aws.amazon.com/iam/
   - Click "Users" → "Create user"

2. **Create User**

   ```
   User name: careerhub-s3-user
   Access type: Programmatic access
   ```

3. **Attach Policy**
   - Click "Attach existing policies directly"
   - Search for "AmazonS3FullAccess" (or create custom policy)

### 3. Custom IAM Policy (Recommended)

Create a more restrictive policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-careerhub-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::your-careerhub-bucket-name"
    }
  ]
}
```

### 4. Environment Variables

Create `.env` file in your backend directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/careerhub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-careerhub-bucket-name

# Server Configuration
PORT=5050
```

### 5. Install Required Dependencies

```bash
cd backend
npm install aws-sdk multer-s3
```

## 🔒 Security Features

### Pre-signed URLs

- Files are stored privately in S3
- Access is granted via temporary pre-signed URLs
- URLs expire after 1 hour by default
- No public access to files

### File Validation

- Only images and PDFs allowed
- 5MB file size limit
- Unique filenames with timestamps
- Proper error handling

### Access Control

- Private bucket with no public access
- IAM user with minimal required permissions
- Secure file deletion capabilities

## 📁 File Structure

```
S3 Bucket: careerhub-files-[id]
├── profileImage-[timestamp]-[random].jpg
├── idVerification-[timestamp]-[random].pdf
└── other-documents/
```

## 🔧 API Endpoints

### Upload Files

```
POST /api/mentors/register
Content-Type: multipart/form-data
```

### Get File URL

```
GET /api/mentors/file/:fileKey
Response: { url: "pre-signed-url", expiresIn: 3600 }
```

## 🚨 Important Security Notes

1. **Never commit `.env` files** to version control
2. **Rotate AWS keys** regularly
3. **Monitor S3 access** through CloudTrail
4. **Set up billing alerts** to avoid unexpected charges
5. **Use least privilege** principle for IAM policies

## 🧪 Testing

1. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

2. **Test file upload**

   - Use Postman or similar tool
   - Upload a profile image and ID verification document
   - Verify files are stored in S3

3. **Test file access**
   - Get pre-signed URL via API
   - Verify URL works and expires after 1 hour

## 🔄 Migration from Local Storage

If you're migrating from local storage:

1. **Backup existing files**
2. **Upload to S3** using AWS CLI or console
3. **Update database** with S3 keys
4. **Test thoroughly** before removing local files

## 📞 Support

If you encounter issues:

1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Ensure environment variables are set correctly
4. Test with AWS CLI for S3 access
