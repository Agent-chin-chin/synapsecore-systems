export interface UserListOptions {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function getUserById(userId: string): Promise<any>;
export function getUserByEmail(email: string): Promise<any>;
export function getUsers(options?: UserListOptions): Promise<{ users: any[]; pagination: Pagination }>;
export function updateUserRole(userId: string, role: string): Promise<any>;
export function updateUserStatus(userId: string, status: string): Promise<any>;
export function deleteUser(userId: string): Promise<{ message: string }>;