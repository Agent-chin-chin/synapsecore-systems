const dotenv = require('dotenv');
const path = require('path');

const envPath = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const DEFAULT_LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/synapsecoresystem';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';

function requireEnvKeys(keys) {
  const missing = keys.filter((key) => !process.env[key] || process.env[key].trim() === '');
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

requireEnvKeys(['JWT_SECRET']);
if (IS_PRODUCTION) {
  requireEnvKeys(['MONGODB_URI']);
}

if (IS_PRODUCTION && process.env.SMTP_HOST) {
  requireEnvKeys(['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM']);
}

if (process.env.SMS_PROVIDER?.toLowerCase() === 'twilio') {
  requireEnvKeys(['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER']);
}

const SMTP_PORT = Number(process.env.SMTP_PORT || '587');

const config = {
  NODE_ENV,
  IS_PRODUCTION,
  PORT: Number(process.env.PORT || '3000'),
  MONGODB_URI: process.env.MONGODB_URI || DEFAULT_LOCAL_MONGODB_URI,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '"SynapseCore Notifications" <noreply@synapsecore.com>',
  SMS_PROVIDER: process.env.SMS_PROVIDER || '',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_FROM_NUMBER: process.env.TWILIO_FROM_NUMBER || '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
  AWS_S3_REGION: process.env.AWS_S3_REGION || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  CSRF_SECRET: process.env.CSRF_SECRET || process.env.JWT_SECRET || '',
  ALLOWED_UPLOAD_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/zip'
  ],
  MAX_UPLOAD_SIZE_BYTES: 10 * 1024 * 1024,
  S3_ENABLED: Boolean(process.env.AWS_S3_BUCKET && process.env.AWS_S3_REGION),
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || '',
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || '',
  PAYSTACK_WEBHOOK_SECRET: process.env.PAYSTACK_WEBHOOK_SECRET || ''
};

if (!config.CSRF_SECRET) {
  throw new Error('Missing CSRF_SECRET environment variable or JWT_SECRET fallback');
}

if (IS_PRODUCTION && !config.S3_ENABLED && process.env.AWS_S3_BUCKET) {
  throw new Error('Production deployment requires AWS_S3_BUCKET and AWS_S3_REGION to be configured');
}

module.exports = config;
