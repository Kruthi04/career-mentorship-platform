const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check for AWS credentials
const hasAwsCredentials = true; // Re-enable S3
// const hasAwsCredentials =
//   process.env.AWS_ACCESS_KEY_ID &&
//   process.env.AWS_SECRET_ACCESS_KEY &&
//   process.env.AWS_REGION;
console.log("AWS credentials available:", !!hasAwsCredentials);

console.log("=== S3 Configuration Debug ===");
console.log(
  "AWS_ACCESS_KEY_ID:",
  process.env.AWS_ACCESS_KEY_ID ? "Present" : "Missing"
);
console.log(
  "AWS_SECRET_ACCESS_KEY:",
  process.env.AWS_SECRET_ACCESS_KEY ? "Present" : "Missing"
);
console.log("AWS_S3_BUCKET_NAME:", process.env.AWS_S3_BUCKET_NAME || "Missing");
console.log("AWS_REGION:", process.env.AWS_REGION || "us-east-1");
console.log("Has AWS credentials:", hasAwsCredentials);
console.log("=================================");

let upload, s3, generatePresignedUrl, deleteFileFromS3, getS3Url;

if (hasAwsCredentials) {
  // Use S3 configuration
  const AWS = require("aws-sdk");
  const multerS3 = require("multer-s3");

  // Configure AWS
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || "us-east-1",
  });

  s3 = new AWS.S3();

  // Configure multer for S3 upload
  console.log(
    "Configuring S3 upload with bucket:",
    process.env.AWS_S3_BUCKET_NAME
  );
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: "private", // Keep files private
      metadata: (req, file, cb) => {
        console.log("Setting metadata for file:", file.originalname);
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const key = `mentor/profile-image/${fileName}`;
        console.log("Generated S3 key:", key);
        cb(null, key);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow images and PDFs
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only images and PDFs are allowed"), false);
      }
    },
  });

  // Configure multer for user profile images (separate from mentor uploads)
  uploadUserProfile = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: "private", // Keep files private
      metadata: (req, file, cb) => {
        console.log(
          "Setting metadata for user profile image:",
          file.originalname
        );
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `profile-${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const key = `users/profile-images/${fileName}`;
        console.log("Generated user profile S3 key:", key);
        cb(null, key);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow images for profile pictures
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(
          new Error("Only image files are allowed for profile pictures"),
          false
        );
      }
    },
  });

  // Configure multer for mentor profile images (also saves to users folder)
  uploadMentorProfile = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: "private", // Keep files private
      metadata: (req, file, cb) => {
        console.log(
          "Setting metadata for mentor profile image:",
          file.originalname
        );
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `mentor-profile-${uniqueSuffix}${path.extname(
          file.originalname
        )}`;
        const key = `users/profile-images/${fileName}`;
        console.log("Generated mentor profile S3 key:", key);
        cb(null, key);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow images for profile pictures
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(
          new Error("Only image files are allowed for profile pictures"),
          false
        );
      }
    },
  });

  // S3 functions
  generatePresignedUrl = async (fileKey, expiresIn = 3600) => {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET || "career-mentorship-platform",
        Key: fileKey,
        Expires: expiresIn, // URL expires in 1 hour by default
      };

      const presignedUrl = await s3.getSignedUrlPromise("getObject", params);
      return presignedUrl;
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw error;
    }
  };

  deleteFileFromS3 = async (fileKey) => {
    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET || "career-mentorship-platform",
        Key: fileKey,
      };

      await s3.deleteObject(params).promise();
      console.log(`File deleted from S3: ${fileKey}`);
      return true;
    } catch (error) {
      console.error("Error deleting file from S3:", error);
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
      console.error("Error generating pre-signed URL:", error);
      return null;
    }
  };
} else {
  // Use local storage as fallback
  console.log(
    "AWS credentials not found. Using local file storage as fallback."
  );

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, "../../uploads");
  const mentorDir = path.join(uploadsDir, "mentor");
  const profileImageDir = path.join(mentorDir, "profile-image");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(mentorDir)) {
    fs.mkdirSync(mentorDir, { recursive: true });
  }
  if (!fs.existsSync(profileImageDir)) {
    fs.mkdirSync(profileImageDir, { recursive: true });
  }

  // Configure multer for local file storage
  upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, profileImageDir);
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
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow images and PDFs
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only images and PDFs are allowed"), false);
      }
    },
  });

  // Local storage functions
  generatePresignedUrl = async (fileKey) => {
    // For local storage, return the file path
    return `/uploads/mentor/profile-image/${fileKey}`;
  };

  deleteFileFromS3 = async (fileKey) => {
    try {
      const filePath = path.join(
        __dirname,
        "../../uploads/mentor/profile-image",
        fileKey
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted from local storage: ${fileKey}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file from local storage:", error);
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
    return `/uploads/mentor/profile-image/${fileKey}`;
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
  uploadUserProfile,
  uploadMentorProfile,
  deleteFileFromS3,
  getS3Url,
  generatePresignedUrl,
  s3,
};
