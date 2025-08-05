const Resume = require("../models/Resume");
const User = require("../models/User");
const { getS3Url, deleteFileFromS3 } = require("../config/resumeUpload");

// Upload resume file to S3
exports.uploadResume = async (req, res) => {
  try {
    console.log("=== Resume Upload Request ===");
    console.log("User ID:", req.user.userId);
    console.log("File:", req.file);
    console.log("Body:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user.userId;
    const {
      title,
      description,
      tags,
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Determine file type
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    let fileType;
    switch (fileExtension) {
      case "pdf":
        fileType = "pdf";
        break;
      case "doc":
        fileType = "doc";
        break;
      case "docx":
        fileType = "docx";
        break;
      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
        });
    }

    // Create resume record
    const resume = new Resume({
      userId,
      title: title || req.file.originalname,
      description: description || "",
      fileKey: req.file.key || req.file.filename, // S3 key or local filename
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      fileType,
      uploadMethod: "file",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    });

    await resume.save();

    console.log("Resume saved to database:", resume._id);

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        title: resume.title,
        originalFileName: resume.originalFileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        uploadMethod: resume.uploadMethod,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading resume",
      error: error.message,
    });
  }
};

// Store resume link in MongoDB
exports.storeResumeLink = async (req, res) => {
  try {
    console.log("=== Resume Link Storage Request ===");
    console.log("User ID:", req.user.userId);
    console.log("Body:", req.body);

    const userId = req.user.userId;
    const {
      title,
      description,
      resumeLink,
      tags,
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    } = req.body;

    // Validate required fields
    if (!resumeLink) {
      return res.status(400).json({
        success: false,
        message: "Resume link is required",
      });
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+$/;
    if (!urlRegex.test(resumeLink)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Determine file type from URL (basic detection)
    let fileType = "pdf"; // default
    if (resumeLink.includes(".doc")) {
      fileType = "doc";
    } else if (resumeLink.includes(".docx")) {
      fileType = "docx";
    }

    // Create resume record
    const resume = new Resume({
      userId,
      title: title || "Resume Link",
      description: description || "",
      resumeLink,
      originalFileName: "Resume Link",
      fileType,
      uploadMethod: "link",
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    });

    await resume.save();

    console.log("Resume link saved to database:", resume._id);

    res.status(201).json({
      success: true,
      message: "Resume link stored successfully",
      resume: {
        id: resume._id,
        title: resume.title,
        resumeLink: resume.resumeLink,
        fileType: resume.fileType,
        uploadMethod: resume.uploadMethod,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error("Error storing resume link:", error);
    res.status(500).json({
      success: false,
      message: "Error storing resume link",
      error: error.message,
    });
  }
};

// Get user's resumes
exports.getUserResumes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    // Generate presigned URLs for file uploads
    const resumesWithUrls = await Promise.all(
      resumes.map(async (resume) => {
        const resumeObj = resume.toObject();

        if (resume.uploadMethod === "file" && resume.fileKey) {
          resumeObj.fileUrl = await getS3Url(resume.fileKey);
        } else if (resume.uploadMethod === "link") {
          resumeObj.fileUrl = resume.resumeLink;
        }

        return resumeObj;
      })
    );

    res.json({
      success: true,
      resumes: resumesWithUrls,
    });
  } catch (error) {
    console.error("Error fetching user resumes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resumes",
      error: error.message,
    });
  }
};

// Get single resume
exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resumeObj = resume.toObject();

    // Generate presigned URL if it's a file upload
    if (resume.uploadMethod === "file" && resume.fileKey) {
      resumeObj.fileUrl = await getS3Url(resume.fileKey);
    } else if (resume.uploadMethod === "link") {
      resumeObj.fileUrl = resume.resumeLink;
    }

    res.json({
      success: true,
      resume: resumeObj,
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching resume",
      error: error.message,
    });
  }
};

// Update resume
exports.updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;
    const { title, description, tags, isPublic } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Update fields
    if (title) resume.title = title;
    if (description !== undefined) resume.description = description;
    if (tags) resume.tags = tags.split(",").map((tag) => tag.trim());
    if (isPublic !== undefined) resume.isPublic = isPublic;

    await resume.save();

    res.json({
      success: true,
      message: "Resume updated successfully",
      resume: {
        id: resume._id,
        title: resume.title,
        description: resume.description,
        tags: resume.tags,
        isPublic: resume.isPublic,
        updatedAt: resume.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({
      success: false,
      message: "Error updating resume",
      error: error.message,
    });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Delete file from S3 if it's a file upload
    if (resume.uploadMethod === "file" && resume.fileKey) {
      await deleteFileFromS3(resume.fileKey);
    }

    await Resume.findByIdAndDelete(resumeId);

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting resume",
      error: error.message,
    });
  }
};

// Get resume download URL
exports.getResumeDownloadUrl = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    let downloadUrl;

    if (resume.uploadMethod === "file" && resume.fileKey) {
      // Generate presigned URL for file download
      downloadUrl = await getS3Url(resume.fileKey);
    } else if (resume.uploadMethod === "link") {
      // Return the link directly
      downloadUrl = resume.resumeLink;
    } else {
      return res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }

    res.json({
      success: true,
      downloadUrl,
      fileName: resume.originalFileName,
    });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({
      success: false,
      message: "Error generating download URL",
      error: error.message,
    });
  }
};

// Get user's career services (resumes and LinkedIn reviews)
exports.getUserCareerServices = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("=== Get User Career Services ===");
    console.log("User ID:", userId);

    // Get all resumes for the user
    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select("-fileKey -resumeLink"); // Don't include sensitive data

    console.log(`Found ${resumes.length} resumes for user`);

    // Get all LinkedIn reviews for the user
    const LinkedIn = require("../models/LinkedIn");
    const linkedInReviews = await LinkedIn.find({ userId })
      .sort({ createdAt: -1 })
      .populate("reviewerId", "fullName professionalTitle");

    console.log(`Found ${linkedInReviews.length} LinkedIn reviews for user`);
    console.log(
      "LinkedIn reviews:",
      linkedInReviews.map((r) => ({
        id: r._id,
        title: r.title,
        createdAt: r.createdAt,
      }))
    );

    // Combine and format career services
    const careerServices = [
      ...resumes.map((resume) => ({
        ...resume.toObject(),
        serviceType: "resume_review",
      })),
      ...linkedInReviews.map((review) => ({
        ...review.toObject(),
        serviceType: "linkedin_review",
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(
      `Found ${careerServices.length} total career services for user`
    );

    res.status(200).json({
      success: true,
      message: "Career services retrieved successfully",
      careerServices,
    });
  } catch (error) {
    console.error("Error getting user career services:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving career services",
      error: error.message,
    });
  }
};
