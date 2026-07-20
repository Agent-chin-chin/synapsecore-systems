let client;
let S3Client, PutObjectCommand;
let s3Available = false;
const crypto = require('crypto');
const config = require('../config');

try {
  ({ S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'));
  s3Available = true;
} catch (e) {
  // AWS SDK not installed - S3 features will be disabled
}

if (config.S3_ENABLED && s3Available) {
  client = new S3Client({ region: config.AWS_S3_REGION });
}

function buildS3Key(filename) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-_]/g, '-').slice(0, 200);
  return `uploads/${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeFilename}`;
}

async function uploadFile(buffer, filename, contentType, metadata = {}) {
  if (!config.S3_ENABLED || !s3Available) {
    throw new Error('AWS S3 storage is not configured');
  }

  const Key = buildS3Key(filename);
  const command = new PutObjectCommand({
    Bucket: config.AWS_S3_BUCKET,
    Key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'private',
    Metadata: {
      uploadedBy: 'synapsecore',
      ...metadata
    }
  });

  await client.send(command);

  return {
    url: `https://${config.AWS_S3_BUCKET}.s3.${config.AWS_S3_REGION}.amazonaws.com/${Key}`,
    key: Key
  };
}

module.exports = {
  uploadFile
};
