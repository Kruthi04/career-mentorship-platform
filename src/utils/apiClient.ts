import sessionManager from './sessionManager';

class ApiClient {
  private baseURL: string = 'http://localhost:5050/api';

  // Make API request with session handling
  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add authorization header if token exists
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      console.log(`Making API request to: ${this.baseURL}${endpoint}`);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      console.log(`Response status: ${response.status}`);
      
      // Handle session expiration
      if (response.status === 401) {
        const errorData = await response.json();
        if (errorData.sessionExpired) {
          console.log('Session expired, logging out user');
          sessionManager.logout();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request details:', {
        url: `${this.baseURL}${endpoint}`,
        method: options.method || 'GET',
        headers: config.headers
      });
      
      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      } else if (error instanceof Error) {
        throw new Error(`Network error: ${error.message}`);
      } else {
        throw new Error('Network error: Failed to fetch. Please check your connection and try again.');
      }
    }
  }

  // GET request
  async get(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint: string, data?: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put(endpoint: string, data?: any): Promise<Response> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete(endpoint: string): Promise<Response> {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Check session status
  async checkSession(): Promise<any> {
    try {
      const response = await this.get('/auth/session');
      const data = await response.json();
      
      if (data.isLoggedIn) {
        sessionManager.startSession();
      } else {
        sessionManager.logout();
      }
      
      return data;
    } catch (error) {
      console.error('Session check failed:', error);
      sessionManager.logout();
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionManager.logout();
    }
  }
}

export default new ApiClient(); 