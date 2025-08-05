const axios = require("axios");
const crypto = require("crypto");

class PhylloService {
  constructor() {
    this.baseURL = process.env.PHYLLO_BASE_URL || "https://api.getphyllo.com";
    this.clientId = process.env.PHYLLO_CLIENT_ID;
    this.clientSecret = process.env.PHYLLO_CLIENT_SECRET;
    this.webhookSecret = process.env.PHYLLO_WEBHOOK_SECRET;
  }

  // Generate Phyllo signature for API requests
  generateSignature(timestamp, body = "") {
    const message = timestamp + body;
    return crypto
      .createHmac("sha256", this.clientSecret)
      .update(message)
      .digest("hex");
  }

  // Create a user in Phyllo
  async createUser(userId, userData) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = JSON.stringify({
        user_id: userId,
        display_name: userData.name,
        email: userData.email,
        phone_number: userData.phone || null,
      });

      const signature = this.generateSignature(timestamp, body);

      const response = await axios.post(`${this.baseURL}/v1/users`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-Phyllo-Timestamp": timestamp,
          "X-Phyllo-Signature": signature,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error creating Phyllo user:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Create a LinkedIn account connection
  async createLinkedInConnection(userId, linkedInUrl) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const body = JSON.stringify({
        user_id: userId,
        platform: "linkedin",
        platform_user_id: linkedInUrl, // LinkedIn URL as identifier
        metadata: {
          linkedin_url: linkedInUrl,
        },
      });

      const signature = this.generateSignature(timestamp, body);

      const response = await axios.post(`${this.baseURL}/v1/accounts`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-Phyllo-Timestamp": timestamp,
          "X-Phyllo-Signature": signature,
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error creating LinkedIn connection:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get account details and verification status
  async getAccountDetails(accountId) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = this.generateSignature(timestamp);

      const response = await axios.get(
        `${this.baseURL}/v1/accounts/${accountId}`,
        {
          headers: {
            "X-Phyllo-Timestamp": timestamp,
            "X-Phyllo-Signature": signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error getting account details:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get user's LinkedIn profile data
  async getLinkedInProfile(accountId) {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = this.generateSignature(timestamp);

      const response = await axios.get(
        `${this.baseURL}/v1/accounts/${accountId}/profile`,
        {
          headers: {
            "X-Phyllo-Timestamp": timestamp,
            "X-Phyllo-Signature": signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error getting LinkedIn profile:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(timestamp, signature, body) {
    const expectedSignature = this.generateSignature(timestamp, body);
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }

  // Handle webhook events
  async handleWebhook(event) {
    try {
      console.log("Phyllo webhook received:", event);

      switch (event.event_type) {
        case "account.created":
          return await this.handleAccountCreated(event);
        case "account.updated":
          return await this.handleAccountUpdated(event);
        case "account.connected":
          return await this.handleAccountConnected(event);
        case "account.disconnected":
          return await this.handleAccountDisconnected(event);
        default:
          console.log("Unhandled webhook event type:", event.event_type);
          return { success: true, message: "Event ignored" };
      }
    } catch (error) {
      console.error("Error handling Phyllo webhook:", error);
      throw error;
    }
  }

  // Handle account created event
  async handleAccountCreated(event) {
    const { user_id, account_id, platform } = event.data;

    // Update user's LinkedIn verification status
    const User = require("../models/User");
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        "linkedInProfile.phylloAccountId": account_id,
        "linkedInProfile.verificationStatus": "pending",
        "linkedInProfile.lastUpdated": new Date(),
      }
    );

    return { success: true, message: "Account created" };
  }

  // Handle account connected event
  async handleAccountConnected(event) {
    const { user_id, account_id, platform } = event.data;

    // Update user's LinkedIn verification status
    const User = require("../models/User");
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        "linkedInProfile.verificationStatus": "connected",
        "linkedInProfile.lastUpdated": new Date(),
      }
    );

    return { success: true, message: "Account connected" };
  }

  // Handle account updated event
  async handleAccountUpdated(event) {
    const { user_id, account_id, platform } = event.data;

    // Update user's LinkedIn verification status
    const User = require("../models/User");
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        "linkedInProfile.lastUpdated": new Date(),
      }
    );

    return { success: true, message: "Account updated" };
  }

  // Handle account disconnected event
  async handleAccountDisconnected(event) {
    const { user_id, account_id, platform } = event.data;

    // Update user's LinkedIn verification status
    const User = require("../models/User");
    await User.findOneAndUpdate(
      { _id: user_id },
      {
        "linkedInProfile.verificationStatus": "disconnected",
        "linkedInProfile.lastUpdated": new Date(),
      }
    );

    return { success: true, message: "Account disconnected" };
  }
}

module.exports = new PhylloService();
