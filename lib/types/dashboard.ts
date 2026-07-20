/* Dashboard Types */
export interface DashboardMetrics {
  incidents: {
    total: number;
    active: number;
    resolved: number;
    critical: number;
  };
  performance: {
    averageResponseTime: number;
    uptime: number;
    threatDetectionRate: number;
    falsePositiveRate: number;
  };
  team: {
    activeAnalysts: number;
    availableCapacity: number;
    shifts: ShiftInfo[];
  };
  system: {
    alerts: number;
    integrations: number;
    dataProcessed: number;
  };
}

export interface ShiftInfo {
  id: string;
  analyst: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'break' | 'offline';
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface IncidentChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface ActivityFeedItem {
  id: string;
  type: 'incident' | 'alert' | 'user' | 'system';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  incidentId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  type: 'alert' | 'update' | 'reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}