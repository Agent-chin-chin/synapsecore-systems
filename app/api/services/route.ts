import { NextResponse } from 'next/server';

// Define the service types as per the updated plan
const serviceTypes = [
  {
    id: 'bug-fixing',
    name: 'Bug Fixing',
    description: 'We identify and fix software bugs in web applications, mobile apps, and enterprise systems.'
  },
  {
    id: 'malware-removal',
    name: 'Malware Removal',
    description: 'Expert malware detection and removal services for websites, servers, and applications.'
  },
  {
    id: 'website-recovery',
    name: 'Website Recovery',
    description: 'Get your hacked website back online quickly and securely with our recovery specialists.'
  },
  {
    id: 'wordpress',
    name: 'WordPress Security',
    description: 'Specialized WordPress bug fixes, security hardening, and performance optimization.'
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway Issues',
    description: 'Fix payment processing errors, integration issues, and security vulnerabilities in payment systems.'
  },
  {
    id: 'server-security',
    name: 'Server Security',
    description: 'Comprehensive server security services including configuration hardening, vulnerability assessment, and ongoing protection.'
  },
  {
    id: 'database-repair',
    name: 'Database Repair',
    description: 'Expert database repair and recovery services for corrupted or damaged databases.'
  },
  {
    id: 'emergency-support',
    name: 'Emergency Support',
    description: '24/7 emergency cybersecurity support for critical incidents and security breaches.'
  }
];

// GET: Retrieve all service types
export async function GET() {
  return NextResponse.json({ services: serviceTypes }, { status: 200 });
}