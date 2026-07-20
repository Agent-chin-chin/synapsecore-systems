/* API Response Types */
import { Incident } from './incident';
import { UserProfile } from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T | null;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface IncidentResponse {
  incident: Incident;
  assignedEngineer?: UserProfile;
  user: UserProfile;
}

export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedToday: number;
  averageResponseTime: number;
  systemHealth: {
    uptime: number;
    cpu: number;
    memory: number;
    alerts: number;
  };
}

export interface ActivityItem {
  id: string;
  type: 'incident_created' | 'incident_updated' | 'user_action' | 'system_event';
  title: string;
  description: string;
  timestamp: string;
  user?: UserProfile;
  metadata?: Record<string, any>;
}