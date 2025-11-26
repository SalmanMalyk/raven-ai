export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name?: string;
      email_confirmed_at?: string;
    };
    session?: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      expires_at?: number;
      token_type: string;
    };
  };
  error?: string | object;
}
