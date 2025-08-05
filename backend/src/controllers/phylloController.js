const phylloService = require("../services/phylloService");
const User = require("../models/User");

// Initialize LinkedIn verification for a user
exports.initiateLinkedInVerification = async (req, res) => {
  try {
    const { userId, linkedInUrl, userData } = req.body;

    console.log("=== Initiating LinkedIn Verification ===");
    console.log("User ID:", userId);
    console.log("LinkedIn URL:", linkedInUrl);

    // Validate required fields
    if (!userId || !linkedInUrl || !userData) {
      return res.status(400).json({
        success: false,
        message: "User ID, LinkedIn URL, and user data are required",
      });
    }

    // Validate LinkedIn URL format
    const linkedInUrlRegex =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedInUrlRegex.test(linkedInUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL format",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create user in Phyllo
    const phylloUser = await phylloService.createUser(userId, userData);
    console.log("Phyllo user created:", phylloUser);

    // Create LinkedIn connection
    const linkedInConnection = await phylloService.createLinkedInConnection(
      userId,
      linkedInUrl
    );
    console.log("LinkedIn connection created:", linkedInConnection);

    // Update user with Phyllo account information
    await User.findByIdAndUpdate(userId, {
      "linkedInProfile.phylloAccountId": linkedInConnection.data.id,
      "linkedInProfile.linkedInUrl": linkedInUrl,
      "linkedInProfile.verificationStatus": "pending",
      "linkedInProfile.lastUpdated": new Date(),
    });

    res.json({
      success: true,
      message: "LinkedIn verification initiated successfully",
      data: {
        accountId: linkedInConnection.data.id,
        status: "pending",
        linkedInUrl: linkedInUrl,
      },
    });
  } catch (error) {
    console.error("Error initiating LinkedIn verification:", error);
    res.status(500).json({
      success: false,
      message: "Error initiating LinkedIn verification",
      error: error.message,
    });
  }
};

// Get LinkedIn verification status
exports.getLinkedInVerificationStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("=== Getting LinkedIn Verification Status ===");
    console.log("User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const linkedInProfile = user.linkedInProfile;
    if (!linkedInProfile || !linkedInProfile.phylloAccountId) {
      return res.json({
        success: true,
        data: {
          status: "not_initiated",
          message: "LinkedIn verification not initiated",
        },
      });
    }

    // Get account details from Phyllo
    const accountDetails = await phylloService.getAccountDetails(
      linkedInProfile.phylloAccountId
    );

    // Get LinkedIn profile data if account is connected
    let profileData = null;
    if (accountDetails.data.status === "connected") {
      try {
        profileData = await phylloService.getLinkedInProfile(
          linkedInProfile.phylloAccountId
        );
      } catch (error) {
        console.error("Error getting LinkedIn profile:", error);
      }
    }

    res.json({
      success: true,
      data: {
        status: accountDetails.data.status,
        accountId: linkedInProfile.phylloAccountId,
        linkedInUrl: linkedInProfile.linkedInUrl,
        lastUpdated: linkedInProfile.lastUpdated,
        profileData: profileData?.data || null,
      },
    });
  } catch (error) {
    console.error("Error getting LinkedIn verification status:", error);
    res.status(500).json({
      success: false,
      message: "Error getting LinkedIn verification status",
      error: error.message,
    });
  }
};

// Handle Phyllo webhook
exports.handleWebhook = async (req, res) => {
  try {
    console.log("=== Phyllo Webhook Received ===");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const timestamp = req.headers["x-phyllo-timestamp"];
    const signature = req.headers["x-phyllo-signature"];

    if (!timestamp || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required headers",
      });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const isValidSignature = phylloService.verifyWebhookSignature(
      timestamp,
      signature,
      body
    );

    if (!isValidSignature) {
      console.error("Invalid webhook signature");
      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Handle the webhook event
    const result = await phylloService.handleWebhook(req.body);

    res.json({
      success: true,
      message: "Webhook processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error handling Phyllo webhook:", error);
    res.status(500).json({
      success: false,
      message: "Error processing webhook",
      error: error.message,
    });
  }
};

// Verify LinkedIn profile manually (for testing)
exports.verifyLinkedInProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { linkedInUrl, company, position } = req.body;

    console.log("=== Manual LinkedIn Verification ===");
    console.log("User ID:", userId);
    console.log("LinkedIn URL:", linkedInUrl);
    console.log("Company:", company);
    console.log("Position:", position);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get LinkedIn profile data from Phyllo
    if (user.linkedInProfile?.phylloAccountId) {
      try {
        const profileData = await phylloService.getLinkedInProfile(
          user.linkedInProfile.phylloAccountId
        );

        // Extract profile information
        const profile = profileData.data;
        const headline = profile.headline || "";
        const currentCompany = profile.current_company || "";
        const currentPosition = profile.current_position || "";

        // Verify company and position match
        const isCompanyMatch = currentCompany
          .toLowerCase()
          .includes(company.toLowerCase());
        const isPositionMatch = currentPosition
          .toLowerCase()
          .includes(position.toLowerCase());

        const isVerified = isCompanyMatch && isPositionMatch;

        // Update user verification status
        await User.findByIdAndUpdate(userId, {
          "linkedInProfile.verified": isVerified,
          "linkedInProfile.headline": headline,
          "linkedInProfile.company": currentCompany,
          "linkedInProfile.position": currentPosition,
          "linkedInProfile.verificationDate": new Date(),
        });

        res.json({
          success: true,
          data: {
            verified: isVerified,
            headline: headline,
            company: currentCompany,
            position: currentPosition,
            isCompanyMatch,
            isPositionMatch,
          },
        });
      } catch (error) {
        console.error("Error getting LinkedIn profile:", error);
        res.status(500).json({
          success: false,
          message: "Error verifying LinkedIn profile",
          error: error.message,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "LinkedIn verification not initiated",
      });
    }
  } catch (error) {
    console.error("Error verifying LinkedIn profile:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying LinkedIn profile",
      error: error.message,
    });
  }
};
