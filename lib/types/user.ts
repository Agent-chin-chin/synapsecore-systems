export type UserRole = 'admin' | 'client' | 'learner' | 'Super Admin' | 'Support Engineer' | 'Client/User';

export interface User {
  _id: string;
  id: string;
  fullname?: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  createdAt?: Date;
  exp?: number;
  iat?: number;
}

export interface UserDocument extends User {
  comparePassword(candidatePassword: string): Promise<boolean>;
}