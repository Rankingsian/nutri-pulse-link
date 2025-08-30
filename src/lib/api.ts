// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'nurse' | 'patient';
  created_at: string;
}

export interface Patient {
  id: number;
  user_id: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  medical_history?: string;
  nutrition_needs?: string;
  user?: User;
}

export interface Nurse {
  id: number;
  user_id: number;
  specialization: string;
  hospital: string;
  user?: User;
}

export interface HealthRecord {
  id: number;
  patient_id: number;
  nurse_id: number;
  checkup_notes: string;
  prescriptions?: string;
  created_at: string;
  nurse?: Nurse;
}

export interface NutritionPlan {
  id: number;
  patient_id: number;
  nurse_id: number;
  diet_plan: string;
  created_at: string;
  nurse?: Nurse;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'nurse' | 'patient';
  age: number;
  gender: 'male' | 'female' | 'other';
  specialization?: string;
  hospital?: string;
  medical_history?: string;
  nutrition_needs?: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Network error',
          message: 'Failed to parse error response',
        }));

        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Authentication
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async getProfile(): Promise<User & { patient_data?: Patient; nurse_data?: Nurse }> {
    return this.request('/auth/profile');
  }

  // Patient Management
  async getPatient(id: number): Promise<Patient> {
    return this.request<Patient>(`/patients/${id}`);
  }

  async getPatientRecords(id: number): Promise<{ patient_id: number; records: HealthRecord[] }> {
    return this.request(`/patients/${id}/records`);
  }

  async addHealthRecord(id: number, data: { checkup_notes: string; prescriptions?: string }): Promise<{ message: string; record: HealthRecord }> {
    return this.request(`/patients/${id}/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNutritionPlans(id: number): Promise<{ patient_id: number; plans: NutritionPlan[] }> {
    return this.request(`/patients/${id}/nutrition`);
  }

  async addNutritionPlan(id: number, data: { diet_plan: string }): Promise<{ message: string; plan: NutritionPlan }> {
    return this.request(`/patients/${id}/nutrition`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePatient(id: number, data: Partial<Patient>): Promise<{ message: string; patient: Patient }> {
    return this.request(`/patients/${id}/update`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Chatbot
  async sendChatMessage(message: string): Promise<{
    message: string;
    user_message: string;
    ai_response: string;
    timestamp: string;
  }> {
    return this.request('/chatbot/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory(): Promise<{ user_id: number; conversations: ChatMessage[][] }> {
    return this.request('/chatbot/history');
  }

  async clearChatHistory(): Promise<{ message: string }> {
    return this.request('/chatbot/clear-history', {
      method: 'DELETE',
    });
  }

  // Reports
  async generatePatientReport(id: number): Promise<{
    message: string;
    report: any;
  }> {
    return this.request(`/reports/${id}`);
  }

  async getPatientSummary(id: number): Promise<{
    message: string;
    summary: any;
  }> {
    return this.request(`/reports/${id}/summary`);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; message: string; version: string }> {
    return this.request('/health');
  }

  // Logout
  logout() {
    this.setToken(null);
  }
}

// Create and export API instance
export const api = new ApiClient(API_BASE_URL);

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!api.getToken();
};

export const getUserRole = (): 'nurse' | 'patient' | null => {
  const token = api.getToken();
  if (!token) return null;
  
  try {
    // Decode JWT token to get user role
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};
