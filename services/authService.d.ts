export interface AuthUser {
  id: string;
  _id?: string;
  fullname: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  verificationCode?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullname: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  status?: string;
  learnerProfile?: Record<string, any>;
}

export function loginUser(credentials: LoginCredentials): Promise<AuthResult>;
export function registerUser(data: RegisterData): Promise<AuthResult>;
export function generateToken(user: any): string;
export function verifyToken(token: string): any;
export function logoutUser(): { message: string };
export function verifyUserEmail(email: string, code: string): Promise<any>;
export function resendVerificationCode(email: string): Promise<any>;
export function requestPasswordReset(email: string): Promise<any>;
export function resetPassword(email: string, code: string, newPassword: string): Promise<any>;
