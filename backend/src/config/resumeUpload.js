const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check for AWS credentials
const hasAwsCredentials = true; // Re-enable S3
console.log(
  "AWS credentials available for resume uploads:",
  !!hasAwsCredentials
);

let upload, s3, generatePresignedUrl, deleteFileFromS3, getS3Url;

if (hasAwsCredentials) {
  // Use S3 configuration
  const AWS = require("aws-sdk");
  const multerS3 = require("multer-s3");

  // Configure AWS
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "us-east-2",
  });

  s3 = new AWS.S3();

  // Configure multer for S3 resume upload
  console.log(
    "Configuring S3 resume upload with bucket:",
    process.env.AWS_S3_BUCKET_NAME || "career-mentorship-platform"
  );
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME || "career-mentorship-platform",
      acl: "private", // Keep files private
      metadata: (req, file, cb) => {
        console.log("Setting metadata for resume file:", file.originalname);
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const key = `mentee/resume/files/${fileName}`;
        console.log("Generated S3 resume key:", key);
        cb(null, key);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit for resumes
    },
    fileFilter: (req, file, cb) => {
      // Allow PDF, DOC, DOCX files
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Only PDF, DOC, and DOCX files are allowed for resumes"),
          false
        );
      }
    },
  });

  // S3 functions for resumes
  generatePresignedUrl = async (fileKey, expiresIn = 3600) => {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "career-mentorship-platform",
        Key: fileKey,
        Expires: expiresIn, // URL expires in 1 hour by default
      };

      const presignedUrl = await s3.getSignedUrlPromise("getObject", params);
      return presignedUrl;
    } catch (error) {
      console.error("Error generating pre-signed URL for resume:", error);
      throw error;
    }
  };

  deleteFileFromS3 = async (fileKey) => {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || "career-mentorship-platform",
        Key: fileKey,
      };

      await s3.deleteObject(params).promise();
      console.log(`Resume file deleted from S3: ${fileKey}`);
      return true;
    } catch (error) {
      console.error("Error deleting resume file from S3:", error);
      return false;
    }
  };

  getS3Url = async (fileKey) => {
    if (!fileKey) return null;

    // If fileKey already contains full URL, return as is
    if (fileKey.startsWith("http")) {
      return fileKey;
    }

    // Generate pre-signed URL for secure access
    try {
      return await generatePresignedUrl(fileKey);
    } catch (error) {
      console.error("Error generating pre-signed URL for resume:", error);
      return null;
    }
  };
} else {
  // Use local storage as fallback
  console.log(
    "AWS credentials not found. Using local file storage for resumes as fallback."
  );

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, "../../uploads");
  const menteeDir = path.join(uploadsDir, "mentee");
  const resumeDir = path.join(menteeDir, "resume");
  const filesDir = path.join(resumeDir, "files");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(menteeDir)) {
    fs.mkdirSync(menteeDir, { recursive: true });
  }
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
  }

  // Configure multer for local resume storage
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, filesDir);
      },
      filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        cb(null, fileName);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit for resumes
    },
    fileFilter: (req, file, cb) => {
      // Allow PDF, DOC, DOCX files
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Only PDF, DOC, and DOCX files are allowed for resumes"),
          false
        );
      }
    },
  });

  // Local storage functions for resumes
  generatePresignedUrl = async (fileKey) => {
    // For local storage, return the file path
    return `/uploads/mentee/resume/files/${fileKey}`;
  };

  deleteFileFromS3 = async (fileKey) => {
    try {
      const filePath = path.join(
        __dirname,
        "../../uploads/mentee/resume/files",
        fileKey
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Resume file deleted from local storage: ${fileKey}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting resume file from local storage:", error);
      return false;
    }
  };

  getS3Url = (fileKey) => {
    if (!fileKey) return null;

    // If fileKey already contains full URL, return as is
    if (fileKey.startsWith("http")) {
      return fileKey;
    }

    // Return local file path
    return `/uploads/mentee/resume/files/${fileKey}`;
  };

  // Mock S3 object for compatibility
  s3 = {
    deleteObject: () => ({
      promise: () => Promise.resolve(),
    }),
  };
}

module.exports = {
  upload,
  deleteFileFromS3,
  getS3Url,
  generatePresignedUrl,
  s3,
};
