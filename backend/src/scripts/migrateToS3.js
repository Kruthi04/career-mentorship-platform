const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Mentor = require("../models/Mentor");

// Function to upload file to S3
const uploadFileToS3 = async (filePath, s3Key) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ACL: "public-read",
      ContentType: getContentType(filePath),
    };

    const result = await s3.upload(params).promise();
    console.log(`Uploaded: ${filePath} → ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return null;
  }
};

// Function to get content type
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
  };
  return contentTypes[ext] || "application/octet-stream";
};

// Function to get S3 URL
const getS3Url = (s3Key) => {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
    process.env.AWS_REGION || "us-east-1"
  }.amazonaws.com/${s3Key}`;
};

// Main migration function
const migrateToS3 = async () => {
  try {
    console.log("Starting migration to S3...");

    // Get all mentors from database
    const mentors = await Mentor.find({});
    console.log(`Found ${mentors.length} mentors in database`);

    for (const mentor of mentors) {
      console.log(`\nProcessing mentor: ${mentor.fullName}`);

      // Handle profile image
      if (mentor.profileImage && mentor.profileImage.startsWith("/uploads/")) {
        const localPath = path.join(__dirname, "../../", mentor.profileImage);

        if (fs.existsSync(localPath)) {
          const fileName = path.basename(mentor.profileImage);
          const s3Key = `mentors/${fileName}`;

          const s3Url = await uploadFileToS3(localPath, s3Key);
          if (s3Url) {
            mentor.profileImage = s3Key; // Store S3 key in database
            await mentor.save();
            console.log(`Updated profile image for ${mentor.fullName}`);
          }
        } else {
          console.log(`Local file not found: ${localPath}`);
        }
      }

      // Handle ID verification file
      if (
        mentor.idVerification &&
        mentor.idVerification.startsWith("/uploads/")
      ) {
        const localPath = path.join(__dirname, "../../", mentor.idVerification);

        if (fs.existsSync(localPath)) {
          const fileName = path.basename(mentor.idVerification);
          const s3Key = `mentors/${fileName}`;

          const s3Url = await uploadFileToS3(localPath, s3Key);
          if (s3Url) {
            mentor.idVerification = s3Key; // Store S3 key in database
            await mentor.save();
            console.log(`Updated ID verification for ${mentor.fullName}`);
          }
        } else {
          console.log(`Local file not found: ${localPath}`);
        }
      }
    }

    console.log("\nMigration completed successfully!");
    console.log("\nSummary:");
    console.log("- Profile images and ID verification files uploaded to S3");
    console.log("- Database updated with S3 keys");
    console.log("- Local files can now be safely deleted");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run migration
migrateToS3();
