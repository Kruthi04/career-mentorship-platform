const sessionAuth = (req, res, next) => {
  // Check if user has an active session
  if (req.session && req.session.userId) {
    // Update session timestamp to extend session
    req.session.lastActivity = Date.now();
    next();
  } else {
    res.status(401).json({
      message: "Session expired. Please log in again.",
      sessionExpired: true,
    });
  }
};

// Middleware to check session timeout (30 minutes)
const checkSessionTimeout = (req, res, next) => {
  if (req.session && req.session.lastActivity) {
    const now = Date.now();
    const sessionAge = now - req.session.lastActivity;
    const maxAge = 30 * 60 * 1000; // 30 minutes

    if (sessionAge > maxAge) {
      // Session expired, destroy it
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      return res.status(401).json({
        message: "Session expired due to inactivity. Please log in again.",
        sessionExpired: true,
      });
    }
  }
  next();
};

module.exports = { sessionAuth, checkSessionTimeout };
