const emailTemplate = ({
  title,
  message,
  securityNote,
} = {}) => {
  const _brand = "Insta Arab";
  const _title = title
    ? `${title} - ${_brand}`
    : `Verify your email - ${_brand}`;
  const _headerTitle = title || "Verify Your Email";
  const _headerBrand = _brand;
  const _messageHtml = message || `Welcome to <span class="highlight">${_brand}</span>!`;
  const _securityNoteHtml =
    securityNote ||
    `<strong>Security Notice:</strong> This code will expire in 5 minutes.`;

  const facebook = process.env.facebookLink || "#";
  const instagram = process.env.instegram || "#";
  const twitter = process.env.twitterLink || "#";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${_title}</title>
  <style>
    body, table, td, p { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      margin: 0; padding: 0;
    }
    .email-wrapper { background: #f5f5f5; padding: 20px 0; }
    .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #e91e63, #f06292); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; }
    .content { padding: 30px; text-align: center; }
    .message { font-size: 16px; color: #333; margin-bottom: 20px; }
    .otp-code { font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #e91e63; margin: 20px 0; }
    .security-note { background: #f8f9fa; border-left: 4px solid #e91e63; padding: 15px; margin: 30px 0; text-align: left; font-size: 14px; color: #666; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <h1>${_headerTitle}</h1>
        <p class="brand">${_headerBrand}</p>
      </div>
      <div class="content">
        <p class="message">${_messageHtml}</p>
        <div class="security-note">
          <p>${_securityNoteHtml}</p>
        </div>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${_brand}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = { emailTemplate };