const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST || 'smtp.ethereal.email',
  port: config.SMTP_PORT || 587,
  secure: config.SMTP_PORT === 465,
  auth: {
    user: config.IS_PRODUCTION ? config.SMTP_USER : process.env.ETHEREAL_EMAIL || config.SMTP_USER,
    pass: config.IS_PRODUCTION ? config.SMTP_PASSWORD : process.env.ETHEREAL_PASSWORD || config.SMTP_PASSWORD
  }
});

function buildEmailTemplate(title, body) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f4f6fb; padding: 24px; border-radius: 12px;">
      <div style="background: #0f172a; color: #fff; padding: 18px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 22px;">${title}</h1>
      </div>
      <div style="background: #ffffff; color: #111827; padding: 24px; border-radius: 0 0 12px 12px;">
        ${body}
        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">If you did not request this notification, please contact support immediately.</p>
      </div>
    </div>
  `;
}

function formatSection(title, fields) {
  const rows = fields.map(([label, value]) => {
    const displayValue = value === '' || value == null ? '-' : value;
    const escapedLabel = label.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapedValue = String(displayValue).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<tr><td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; width: 35%; vertical-align: top;">${escapedLabel}</td><td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; color: #111827; vertical-align: top;">${escapedValue}</td></tr>`;
  }).join('');

  return `<h3 style="color: #0f172a; margin-top: 24px; margin-bottom: 8px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em;">${title}</h3><table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 8px; overflow: hidden;">${rows}</table>`;
}

function buildLearnerRegistrationEmail(data) {
  const pictureBlock = data.profilePicture
    ? `<div style="margin-bottom: 24px; text-align: center;"><img src="${data.profilePicture}" alt="Profile Picture" style="max-width: 150px; max-height: 150px; border-radius: 50%; border: 3px solid #e2e8f0; object-fit: cover;" /></div>`
    : '';

  const attachment = data.profilePicture
    ? [
        {
          filename: 'profile-picture.jpg',
          content: data.profilePicture.replace(/^data:image\/\w+;base64,/, ''),
          contentType: 'image/jpeg',
        },
      ]
    : [];

  const sections = [
    ['Personal Information', [
      ['Full Name', `${data.firstName || ''} ${data.lastName || ''}`],
      ['Email', data.email || ''],
      ['Phone', data.phone || ''],
      ['Date of Birth', data.dateOfBirth || ''],
      ['Gender', data.gender || ''],
      ['Nationality', data.nationality || ''],
      ['Country of Citizenship', data.countryOfCitizenship || ''],
      ['State / Province of Origin', data.stateOfOrigin || ''],
    ]],
    ['Address & Location', [
      ['Street Address', data.address || ''],
      ['City', data.city || ''],
      ['State / Province', data.state || ''],
      ['Country', data.country || ''],
      ['Postal / ZIP Code', data.postalCode || ''],
      ['Time Zone', data.timeZone || ''],
      ['Preferred Language', data.preferredLanguage || ''],
    ]],
    ['Identification & Documents', [
      ['Means of Identification', data.identificationType || ''],
      ['ID Number', data.identificationNumber || ''],
      ['Date of ID Issuance', data.idIssueDate || ''],
      ['Expiry Date of ID', data.idExpiryDate || ''],
      ['Place of ID Issuance', data.idIssuePlace || ''],
    ]],
    ['Guardian Information', [
      ['Guardian Full Name', data.guardianName || ''],
      ['Guardian Phone', data.guardianPhone || ''],
      ['Guardian Email', data.guardianEmail || ''],
      ['Guardian Address', data.guardianAddress || ''],
      ['Guardian Relationship', data.guardianRelationship || ''],
    ]],
    ['Emergency Contacts', [
      ['Primary Emergency Contact Name', data.emergencyContactName || ''],
      ['Primary Emergency Contact Phone', data.emergencyContactPhone || ''],
      ['Primary Emergency Contact Email', data.emergencyContactEmail || ''],
      ['Primary Emergency Relationship', data.emergencyContactRelationship || ''],
      ['Secondary Emergency Contact Name', data.secondaryEmergencyContactName || ''],
      ['Secondary Emergency Contact Phone', data.secondaryEmergencyContactPhone || ''],
      ['Secondary Emergency Relationship', data.secondaryEmergencyContactRelationship || ''],
    ]],
    ['Education & Background', [
      ['Highest Education Level', data.educationLevel || ''],
      ['Current Employment Status', data.employmentStatus || ''],
      ['Field of Study / Profession', data.fieldOfStudy || ''],
      ['Institution / Employer Name', data.institutionName || ''],
      ['Years of Tech/Cybersecurity Experience', data.yearsOfExperience || ''],
      ['Previous Certifications Held', data.previousCertifications || ''],
    ]],
    ['Verification & Technical', [
      ['How did you hear about us?', data.hearAboutUs || ''],
      ['Referral Code', data.referralCode || ''],
      ['Selected Course / Training Program', data.selectedCourse || ''],
      ['Payment Plan Preference', data.paymentPlanPreference || ''],
      ['Primary Device Type', data.primaryDevice || ''],
      ['Operating System', data.operatingSystem || ''],
      ['Internet Connectivity', data.internetConnectivity || ''],
      ['Preferred Learning Schedule', data.preferredLearningSchedule || ''],
    ]],
    ['Consents & Agreements', [
      ['Background Check Consent', data.backgroundCheckConsent ? 'Yes' : 'No'],
      ['Guardian Consent', data.guardianConsent ? 'Yes' : 'No'],
      ['Data Processing Consent', data.dataProcessingConsent ? 'Yes' : 'No'],
      ['Marketing Communications Opt-in', data.marketingConsent ? 'Yes' : 'No'],
    ]],
  ];

  const body = `
    <p>A new learner registration application has been submitted through the SynapseCore Learning Academy portal.</p>
    <p><strong>Please review the details below and proceed with verification and approval.</strong></p>
    ${pictureBlock}
    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    ${sections.map(([title, fields]) => formatSection(title, fields)).join('')}
  `;

  return sendMail({
    from: config.EMAIL_FROM,
    to: 'synapsecoresystems@gmail.com',
    subject: `${data.firstName || ''} ${data.lastName || ''} Registration Form`,
    text: `New learner registration from ${data.firstName || ''} ${data.lastName || ''} (${data.email || ''}).`,
    html: buildEmailTemplate('New Learner Registration', body),
    attachments: attachment,
  });
}

async function sendMail(options) {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

async function sendBookingConfirmation(user, booking) {
  const body = `
    <p>Hello ${user.fullname},</p>
    <p>Thank you for booking our <strong>${booking.serviceType}</strong> service.</p>
    <h3>Booking Details</h3>
    <ul>
      <li><strong>Service:</strong> ${booking.serviceType}</li>
      <li><strong>Description:</strong> ${booking.description}</li>
      <li><strong>Priority:</strong> ${booking.priority}</li>
      <li><strong>Status:</strong> ${booking.status}</li>
    </ul>
    <p>We will review your request and follow up shortly.</p>
  `;

  return sendMail({
    from: config.EMAIL_FROM,
    to: user.email,
    subject: `Booking Confirmation - ${booking.serviceType}`,
    text: `Hello ${user.fullname},\n\nYour booking has been received and will be reviewed shortly.`,
    html: buildEmailTemplate('Booking Confirmation', body)
  });
}

async function sendAdminNotification(admin, subject, content) {
  return sendMail({
    from: config.EMAIL_FROM,
    to: admin.email,
    subject: `[ALERT] ${subject}`,
    text: content.replace(/<[^>]+>/g, ''),
    html: buildEmailTemplate(subject, `<p>${content}</p>`)
  });
}

async function sendNotificationEmail(recipient, subject, body) {
  return sendMail({
    from: config.EMAIL_FROM,
    to: recipient.email,
    subject: `[SynapseCore] ${subject}`,
    text: body,
    html: buildEmailTemplate(subject, `<p>${body}</p>`)
  });
}

async function sendLearnerRegistrationPDF(data) {
  return buildLearnerRegistrationEmail(data);
}

module.exports = {
  sendBookingConfirmation,
  sendAdminNotification,
  sendNotificationEmail,
  sendLearnerRegistrationPDF
};
