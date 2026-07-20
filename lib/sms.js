const config = require('./config');

async function sendSMS(to, body) {
  if (!config.SMS_PROVIDER || config.SMS_PROVIDER.toLowerCase() !== 'twilio') {
    throw new Error('SMS provider is not configured or unsupported. Set SMS_PROVIDER=twilio.');
  }

  if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_FROM_NUMBER) {
    throw new Error('Twilio SMS configuration is incomplete. Provide TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(config.TWILIO_ACCOUNT_SID)}/Messages.json`;
  const bodyParams = new URLSearchParams();
  bodyParams.append('To', to);
  bodyParams.append('From', config.TWILIO_FROM_NUMBER);
  bodyParams.append('Body', body);

  const authHeader = Buffer.from(`${config.TWILIO_ACCOUNT_SID}:${config.TWILIO_AUTH_TOKEN}`, 'utf-8').toString('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Twilio SMS failed: ${errorText}`);
  }

  return response.json();
}

module.exports = {
  sendSMS
};
