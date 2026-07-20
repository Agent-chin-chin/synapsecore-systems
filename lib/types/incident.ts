export type IncidentStatus = 'open' | 'investigating' | 'assigned' | 'resolved' | 'closed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'urgent';
export type IncidentType = 
  | 'bug-fixing'
  | 'malware-removal'
  | 'website-recovery'
  | 'wordpress'
  | 'payment-gateway'
  | 'server-security'
  | 'database-repair'
  | 'emergency-support';

export interface StatusHistoryEntry {
  status: IncidentStatus;
  timestamp: Date;
  changedBy?: string; // User ID
  notes?: string;
}

export interface ResponseNote {
  _id?: string;
  engineer: string; // User ID
  note: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface Incident {
  _id: string;
  userId: string;
  incidentType: IncidentType;
  description: string;
  priority: IncidentPriority;
  severity: IncidentSeverity;
  status: IncidentStatus;
  statusHistory: StatusHistoryEntry[];
  assignedTo?: string; // User ID
  responseNotes: ResponseNote[];
  attachments: string[];
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentWithPopulated {
  _id: string;
  userId: {
    _id: string;
    fullname: string;
    email: string;
  };
  incidentType: IncidentType;
  description: string;
  priority: IncidentPriority;
  severity: IncidentSeverity;
  status: IncidentStatus;
  statusHistory: StatusHistoryEntry[];
  assignedTo?: {
    _id: string;
    fullname: string;
    email: string;
  };
  responseNotes: ResponseNote[];
  attachments: string[];
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
