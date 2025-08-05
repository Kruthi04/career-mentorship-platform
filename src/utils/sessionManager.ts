class SessionManager {
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes in milliseconds
  private warningTimeout: number = 5 * 60 * 1000; // 5 minutes warning before logout
  private lastActivity: number = Date.now();
  private sessionTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private isLoggedIn: boolean = false;
  
  constructor() {
    this.setupActivityListeners();
  }

  // Setup activity listeners to reset timer on user activity
  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      });
    });
  }

  // Update last activity time
  public updateActivity(): void {
    this.lastActivity = Date.now();
    this.resetTimers();
  }

  // Start session timers
  public startSession(): void {
    this.isLoggedIn = true;
    this.lastActivity = Date.now();
    this.resetTimers();
  }

  // Reset timers
  private resetTimers(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Set warning timer (5 minutes before session expires)
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.sessionTimeout - this.warningTimeout);

    // Set session timeout
    this.sessionTimer = setTimeout(() => {
      this.logout();
    }, this.sessionTimeout);
  }

  // Show warning before logout
  private showWarning(): void {
    const warningMessage = "Your session will expire in 5 minutes due to inactivity. Click anywhere to stay logged in.";
    
    // Create warning modal
    const modal = document.createElement('div');
    modal.className = 'session-modal-overlay';
    
    const content = document.createElement('div');
    content.className = 'session-modal-content warning';
    
    content.innerHTML = `
      <h3 class="session-modal-title warning">Session Timeout Warning</h3>
      <p class="session-modal-message">${warningMessage}</p>
      <button onclick="this.parentElement.parentElement.remove(); window.sessionManager.updateActivity();" 
              class="session-modal-button">
        Stay Logged In
      </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Auto-remove warning after 30 seconds
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 30000);
  }

  // Logout user
  public logout(): void {
    this.isLoggedIn = false;
    
    // Clear timers
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Redirect to home page immediately
    window.location.href = '/';
  }

  // Check if session is still valid
  public isSessionValid(): boolean {
    if (!this.isLoggedIn) return false;
    
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;
    
    return timeSinceLastActivity < this.sessionTimeout;
  }

  // Get remaining session time in minutes
  public getRemainingTime(): number {
    if (!this.isLoggedIn) return 0;
    
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;
    const remainingTime = this.sessionTimeout - timeSinceLastActivity;
    
    return Math.max(0, Math.floor(remainingTime / 60000)); // Convert to minutes
  }
}

// Create global instance
(window as any).sessionManager = new SessionManager();

export default (window as any).sessionManager as SessionManager; 