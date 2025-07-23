# AWS S3 Setup for Image Storage

This guide will help you set up AWS S3 to store profile images and other files for the CareerHub application.

## Prerequisites

1. AWS Account
2. AWS CLI (optional but recommended)
3. Node.js and npm

## Step 1: Create an S3 Bucket

1. **Log into AWS Console**

   - Go to https://aws.amazon.com/console/
   - Sign in to your AWS account

2. **Create S3 Bucket**
   - Navigate to S3 service
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `careerhub-mentor-images`)
   - Select your preferred region (e.g., `us-east-1`)
   - Keep default settings for now
   - Click "Create bucket"

## Step 2: Configure Bucket Permissions

1. **Enable Public Access** (for image serving)

   - Go to your bucket → "Permissions" tab
   - Click "Edit" under "Block public access"
   - Uncheck "Block all public access"
   - Save changes

2. **Add Bucket Policy** (for public read access)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
   - Go to bucket → "Permissions" → "Bucket policy"
   - Paste the above policy (replace `your-bucket-name` with your actual bucket name)
   - Click "Save changes"

## Step 3: Create IAM User

1. **Navigate to IAM**

   - Go to AWS Console → IAM service

2. **Create User**

   - Click "Users" → "Add user"
   - Username: `careerhub-s3-user`
   - Select "Programmatic access"
   - Click "Next: Permissions"

3. **Attach Policy**

   - Click "Attach existing policies directly"
   - Search for "AmazonS3FullAccess"
   - Select it and click "Next: Tags"
   - Add tags if desired, then click "Next: Review"
   - Click "Create user"

4. **Save Credentials**
   - Click "Show" next to "Secret access key"
   - **IMPORTANT**: Save both Access Key ID and Secret Access Key
   - You won't be able to see the secret key again

## Step 4: Update Environment Variables

1. **Edit `.env` file**

   ```bash
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_actual_access_key_here
   AWS_SECRET_ACCESS_KEY=your_actual_secret_key_here
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=your-bucket-name-here
   ```

2. **Replace the placeholder values:**
   - `your_actual_access_key_here` → Your IAM user's Access Key ID
   - `your_actual_secret_key_here` → Your IAM user's Secret Access Key
   - `your-bucket-name-here` → Your S3 bucket name

## Step 5: Test the Setup

1. **Start the server**

   ```bash
   npm start
   ```

2. **Test file upload**
   - Try uploading a profile image through the application
   - Check your S3 bucket to see if the file appears
   - Verify the image loads correctly in the frontend

## Security Best Practices

1. **Use IAM Roles** (for production)

   - Instead of access keys, use IAM roles when deploying to EC2
   - This is more secure than storing credentials

2. **Restrict Permissions**

   - Create a custom IAM policy with minimal required permissions
   - Only allow access to specific bucket and operations

3. **Enable CORS** (if needed)
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

## Troubleshooting

### Common Issues:

1. **"Access Denied" errors**

   - Check IAM user permissions
   - Verify bucket policy is correct
   - Ensure bucket name is correct in .env

2. **Images not loading**

   - Check bucket public access settings
   - Verify bucket policy allows public read
   - Check CORS settings if loading from frontend

3. **Upload failures**
   - Check file size limits (5MB configured)
   - Verify file type (images and PDFs only)
   - Check network connectivity

### Debug Commands:

```bash
# Test S3 connection
aws s3 ls s3://your-bucket-name

# List files in bucket
aws s3 ls s3://your-bucket-name/mentors/

# Check bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name
```

## Migration from Local Storage

If you have existing images in local storage:

1. **Upload to S3**

   ```bash
   aws s3 sync uploads/mentors/ s3://your-bucket-name/mentors/
   ```

2. **Update Database**
   - Run a migration script to update image paths in MongoDB
   - Convert local paths to S3 URLs

## Cost Optimization

1. **Lifecycle Rules**

   - Set up rules to move old files to cheaper storage
   - Delete unused files automatically

2. **CloudFront** (for better performance)
   - Set up CloudFront distribution for faster image loading
   - Update image URLs to use CloudFront domain

## Monitoring

1. **CloudWatch**

   - Monitor S3 usage and costs
   - Set up alerts for unusual activity

2. **Access Logs**
   - Enable S3 access logging
   - Monitor file access patterns
