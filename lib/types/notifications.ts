/* Notification Types */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  priority: NotificationPriority;
  category: NotificationCategory;
  metadata?: Record<string, any>;
  actionUrl?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'incident_assigned'
  | 'incident_updated'
  | 'incident_resolved'
  | 'threat_detected'
  | 'system_alert'
  | 'maintenance_scheduled'
  | 'security_update'
  | 'user_action_required'
  | 'report_generated'
  | 'billing_alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationCategory =
  | 'incidents'
  | 'threats'
  | 'system'
  | 'billing'
  | 'maintenance'
  | 'security';

export interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    types: NotificationType[];
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  sms: {
    enabled: boolean;
    types: NotificationType[];
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  subject: string;
  body: string;
  variables: string[]; // Available template variables
  channels: ('email' | 'push' | 'sms')[];
}

export interface NotificationEvent {
  type: NotificationType;
  userId: string;
  incidentId?: string;
  metadata?: Record<string, any>;
  priority?: NotificationPriority;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  today: number;
  thisWeek: number;
}