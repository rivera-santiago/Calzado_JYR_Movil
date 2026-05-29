export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  occupation: string;
  must_change_password: boolean;
  role: {
    id: number;
    name: string;
    description: string;
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}
