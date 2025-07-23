const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

// Create S3 instance
const s3 = new AWS.S3();

// Configure multer for S3 uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: "public-read", // Make files publicly accessible
    key: (req, file, cb) => {
      // Create unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(
        file.originalname
      )}`;

      // Store in mentors folder within S3 bucket
      cb(null, `mentors/${fileName}`);
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

// Function to delete file from S3
const deleteFileFromS3 = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
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

// Function to get S3 URL for a file
const getS3Url = (fileKey) => {
  if (!fileKey) return null;

  // If fileKey already contains full URL, return as is
  if (fileKey.startsWith("http")) {
    return fileKey;
  }

  // Construct S3 URL
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
    process.env.AWS_REGION || "us-east-1"
  }.amazonaws.com/${fileKey}`;
};

module.exports = {
  upload,
  deleteFileFromS3,
  getS3Url,
  s3,
};
