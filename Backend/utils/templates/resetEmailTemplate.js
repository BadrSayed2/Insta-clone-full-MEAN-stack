const ResetEmailTemplate = ({
  link = "#",
  title,
  message,
  securityNote,
  ctaText,
} = {}) => {
  // Fixed brand and defaults; only selected parts are customizable
  const _brand = "Insta Arab";
  const _title = title
    ? `${title} - ${_brand}`
    : `Verify your email - ${_brand}`;
  const _headerTitle = title || "Verify Your Email";
  const _headerBrand = _brand;
  const _messageHtml =
    message ||
    `Welcome to <span class="highlight">${_brand}</span>!<br><br> Please click the button below to verify your email address and activate your account.`;
  const _ctaText = ctaText || "Verify Email Address";
  const _securityNoteHtml =
    securityNote ||
    `<strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't create this account, please ignore this email.`;
  const _socialTitle = "Follow us on social media:";
  const _footerTop = `© ${new Date().getFullYear()} ${_brand}. All rights reserved.`;
  const _footerBottom =
    "This email was sent because you signed up for an account.";

  const facebook = process.env.facebookLink || "#";
  const instagram = process.env.instegram || "#";
  const twitter = process.env.twitterLink || "#";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${_title}</title>
  <style>
    /* Reset */
    body, table, td, p, a { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    img { border: 0; outline: none; text-decoration: none; }
    table { border-collapse: collapse; }
    
    /* Simplified layout with standard email practices */
    .email-wrapper {
      width: 100%;
      background-color: #f5f5f5;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Compact header with Insta Arab branding */
    .header {
      background: linear-gradient(135deg, #e91e63, #f06292);
      padding: 30px 40px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    
    .header h1 {
      color: white;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .brand {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-top: 5px;
    }
    
    /* Simplified content section */
    .content {
      padding: 40px;
      text-align: center;
    }
    
    .message {
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
      margin-bottom: 30px;
    }
    
    .highlight {
      color: #e91e63;
      font-weight: 600;
    }
    
    /* Standard email button */
    .verify-button {
      display: inline-block;
      background: #e91e63;
      color: white !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      margin: 20px 0;
    }
    
    .verify-button:hover {
      background: #d81b60;
    }
    
    /* Compact security notice */
    .security-note {
      background: #f8f9fa;
      border-left: 4px solid #e91e63;
      padding: 15px 20px;
      margin: 30px 0;
      text-align: left;
    }
    
    .security-note p {
      font-size: 14px;
      color: #666666;
      margin: 0;
      line-height: 1.5;
    }
    
    /* Simple fallback link */
    .fallback {
      margin: 25px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .fallback p {
      font-size: 13px;
      color: #666666;
      margin: 0 0 10px 0;
    }
    
    .fallback-link {
      font-size: 12px;
      color: #e91e63;
      word-break: break-all;
      background: white;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    /* Simplified social links */
    .social {
      margin: 30px 0;
      text-align: center;
    }
    
    .social p {
      font-size: 14px;
      color: #666666;
      margin-bottom: 15px;
    }
    
    .social a {
      display: inline-block;
      margin: 0 8px;
      opacity: 0.8;
    }
    
    .social a:hover {
      opacity: 1;
    }
    
    .social img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
    }
    
    /* Clean footer */
    .footer {
      background: #f8f9fa;
      padding: 20px 40px;
      text-align: center;
      border-radius: 0 0 8px 8px;
      border-top: 1px solid #e0e0e0;
    }
    
    .footer p {
      font-size: 12px;
      color: #999999;
      margin: 5px 0;
      line-height: 1.4;
    }
    
    /* Mobile responsive adjustments */
    @media (max-width: 600px) {
      .email-wrapper {
        padding: 10px;
      }
      
      .header {
        padding: 25px 20px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .footer {
        padding: 15px 20px;
      }
      
      .verify-button {
        padding: 12px 24px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>${_headerTitle}</h1>
              <p class="brand">${_headerBrand}</p>
            </div>
            
            <!-- Content -->
            <div class="content">
              <p class="message">${_messageHtml}</p>
              
              <a href="${link}" class="verify-button" target="_blank" rel="noopener">${_ctaText}</a>
              
              <div class="security-note">
                <p>${_securityNoteHtml}</p>
              </div>
              
              <div class="fallback">
                <p><strong>Button not working?</strong> Copy and paste this link:</p>
                <div class="fallback-link">${link}</div>
              </div>
              
              <div class="social">
                <p>${_socialTitle}</p>
                <a href="${facebook}" aria-label="Facebook">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
                </a>
                <a href="${instagram}" aria-label="Instagram">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" />
                </a>
                <a href="${twitter}" aria-label="Twitter">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p>${_footerTop}</p>
              <p>${_footerBottom}</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
};

module.exports = { ResetEmailTemplate };
