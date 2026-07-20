/* Authentication Types */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  role?: 'admin' | 'client' | 'learner' | 'Super Admin' | 'Support Engineer' | 'Client/User';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfile {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  role: 'admin' | 'client' | 'learner' | 'Super Admin' | 'Support Engineer' | 'Client/User';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isActive: boolean;
}