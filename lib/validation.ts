import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

export const incidentCreateSchema = z.object({
  userId: z.string().optional(),
  incidentType: z.enum([
    'bug-fixing',
    'malware-removal',
    'website-recovery',
    'wordpress',
    'payment-gateway',
    'server-security',
    'database-repair',
    'emergency-support'
  ]),
  description: z.string().min(10, { message: 'Description is required' }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  attachments: z.array(z.string()).optional()
});

export const incidentStatusUpdateSchema = z.object({
  action: z.enum(['update-status', 'assign']),
  status: z.enum(['open', 'investigating', 'assigned', 'resolved', 'closed']).optional(),
  engineerId: z.string().optional(),
  notes: z.string().optional()
}).refine((data) => {
  if (data.action === 'update-status') {
    return !!data.status;
  }
  if (data.action === 'assign') {
    return !!data.engineerId;
  }
  return false;
}, {
  message: 'Missing required fields for action'
});

export const supportTicketSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject is required' }),
  message: z.string().min(10, { message: 'Message is required' }),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export const addNoteSchema = z.object({
  note: z.string().min(3, { message: 'Note is required' }),
  isInternal: z.boolean().optional()
});
