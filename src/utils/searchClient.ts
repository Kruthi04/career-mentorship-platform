import { apiClient } from './apiClient';

export interface SearchParams {
  q?: string;
  areasOfExpertise?: string[];
  skills?: string[];
  minExperience?: number;
  maxHourlyRate?: number;
  helpAreas?: string[];
  page?: number;
  limit?: number;
}

export interface UserSearchParams {
  q?: string;
  userType?: string[];
  page?: number;
  limit?: number;
}

export interface SessionSearchParams {
  q?: string;
  status?: string[];
  sessionType?: string[];
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchSuggestion {
  _id: string;
  fullName?: string;
  professionalTitle?: string;
  areasOfExpertise?: string[];
  count?: number;
}

export interface SearchAnalytics {
  totalMentors: number;
  expertiseAreas: Array<{ _id: string; count: number }>;
  skills: Array<{ _id: string; count: number }>;
  helpAreas: Array<{ _id: string; count: number }>;
  experienceRanges: {
    minExperience: number;
    maxExperience: number;
    avgExperience: number;
  };
  hourlyRateRanges: {
    minRate: number;
    maxRate: number;
    avgRate: number;
  };
}

export interface GlobalSearchResult {
  mentors: any[];
  users: any[];
  sessions: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class SearchClient {
  private baseUrl = '/api/search';

  /**
   * Search mentors with filters
   */
  async searchMentors(params: SearchParams): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.areasOfExpertise?.length) queryParams.append('areasOfExpertise', params.areasOfExpertise.join(','));
    if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
    if (params.minExperience) queryParams.append('minExperience', params.minExperience.toString());
    if (params.maxHourlyRate) queryParams.append('maxHourlyRate', params.maxHourlyRate.toString());
    if (params.helpAreas?.length) queryParams.append('helpAreas', params.helpAreas.join(','));
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`${this.baseUrl}/mentors?${queryParams}`);
    return response.data;
  }

  /**
   * Search users (mentees)
   */
  async searchUsers(params: UserSearchParams): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.userType?.length) queryParams.append('userType', params.userType.join(','));
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`${this.baseUrl}/users?${queryParams}`);
    return response.data;
  }

  /**
   * Search sessions
   */
  async searchSessions(params: SessionSearchParams): Promise<SearchResult<any>> {
    const queryParams = new URLSearchParams();
    
    if (params.q) queryParams.append('q', params.q);
    if (params.status?.length) queryParams.append('status', params.status.join(','));
    if (params.sessionType?.length) queryParams.append('sessionType', params.sessionType.join(','));
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get(`${this.baseUrl}/sessions?${queryParams}`);
    return response.data;
  }

  /**
   * Get search suggestions for autocomplete
   */
  async getSearchSuggestions(query: string, type: 'mentors' | 'skills' | 'expertise' = 'mentors'): Promise<SearchSuggestion[]> {
    if (!query || query.trim().length < 2) return [];

    const queryParams = new URLSearchParams({
      q: query.trim(),
      type
    });

    const response = await apiClient.get(`${this.baseUrl}/suggestions?${queryParams}`);
    return response.data.data || [];
  }

  /**
   * Get search analytics and filters
   */
  async getSearchAnalytics(): Promise<SearchAnalytics> {
    const response = await apiClient.get(`${this.baseUrl}/analytics`);
    return response.data.data;
  }

  /**
   * Global search across all content types
   */
  async globalSearch(query: string, page: number = 1, limit: number = 10): Promise<GlobalSearchResult> {
    if (!query || query.trim().length < 2) {
      return {
        mentors: [],
        users: [],
        sessions: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }

    const queryParams = new URLSearchParams({
      q: query.trim(),
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await apiClient.get(`${this.baseUrl}/global?${queryParams}`);
    return response.data.data;
  }

  /**
   * Debounced search function for real-time search
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Create a debounced search function for mentors
   */
  createDebouncedMentorSearch(wait: number = 300) {
    return this.debounce(this.searchMentors.bind(this), wait);
  }

  /**
   * Create a debounced search function for suggestions
   */
  createDebouncedSuggestions(wait: number = 200) {
    return this.debounce(this.getSearchSuggestions.bind(this), wait);
  }
}

export const searchClient = new SearchClient();

