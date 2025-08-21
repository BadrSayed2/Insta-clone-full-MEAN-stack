const confirmEmailTemplate = ({ link }) => {
  const facebook = process.env.facebookLink || "#";
  const instagram = process.env.instegram || "#";
  const twitter = process.env.twitterLink || "#";
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
    <style>
      /* Reset */
      body,table,td,p,a { font-family: 'Segoe UI', Arial, sans-serif; }
      img { border:0; outline:none; text-decoration:none; }
      table { border-collapse:collapse; }
      body { margin:0; padding:0; background:#0f0f17; -webkit-font-smoothing: antialiased; }
      /* Container */
      .wrapper { width:100%; background:radial-gradient(circle at 20% 20%, #1c1c28, #0f0f17); padding:32px 0; }
      .card { width:100%; max-width:600px; margin:0 auto; background:#141622; border:1px solid #262a36; border-radius:20px; overflow:hidden; box-shadow:0 8px 24px -4px rgba(0,0,0,.6), 0 2px 6px -2px rgba(0,0,0,.5); }
      .top-bar { background:linear-gradient(135deg,#6e4ef7,#b832e5 48%,#ff7d5c); height:6px; }
      .inner { padding:40px 42px 32px; }
      @media (max-width:640px) { .inner { padding:32px 24px 24px; } }
  h1 { margin:0 0 16px; font-size:26px; letter-spacing:.5px; line-height:1.25; background:linear-gradient(90deg,#ffb347,#ff6b6b,#9d6bff); -webkit-background-clip:text; color:transparent; text-align:center; }
      p { margin:0 0 18px; font-size:15px; line-height:1.6; color:#c8ccdc; }
      .highlight { color:#ffffff; font-weight:600; }
      .btn { display:inline-block; margin:12px 0 4px; padding:16px 40px; font-size:15px; font-weight:600; letter-spacing:.6px; color:#fff !important; text-decoration:none; border-radius:14px; background:linear-gradient(90deg,#833ab4,#fd1d1d,#fcb045); box-shadow:0 6px 18px -4px rgba(253,29,29,.45),0 2px 4px -1px rgba(0,0,0,.4); transition:all .35s ease; }
      .btn:hover { filter:brightness(1.15); transform:translateY(-2px); box-shadow:0 10px 28px -6px rgba(253,29,29,.55),0 4px 10px -2px rgba(0,0,0,.55); }
      .divider { height:1px; background:linear-gradient(90deg,transparent,#2d3343,transparent); margin:32px 0 24px; }
      .fallback { font-size:12px; margin-top:10px; color:#8891a7; word-break:break-all; }
      .code-box { background:#1d2030; padding:10px 14px; border:1px solid #2c3242; border-radius:10px; font-size:11px; line-height:1.4; margin-top:6px; color:#ffb347; }
      .social { text-align:center; margin-top:14px; }
      .social a { display:inline-block; margin:0 8px; opacity:.85; transition:opacity .25s ease; }
      .social a:hover { opacity:1; }
      .footer { text-align:center; font-size:11px; color:#61697d; margin-top:40px; padding-bottom:8px; }
      .tag { display:inline-block; font-size:10px; letter-spacing:.8px; background:#1d2030; border:1px solid #2c3242; padding:4px 10px; border-radius:30px; margin-top:12px; color:#a5afc3; }
      @media (prefers-color-scheme: light) { body { background:#eceff4; } .card { background:#ffffff; border:1px solid #e2e6ef; } h1 { background:linear-gradient(90deg,#ff6b6b,#ffb347,#9d6bff); -webkit-background-clip:text; } p { color:#4b5567; } .fallback { color:#4b5567; } .code-box { background:#f5f7fb; border-color:#e4e8f1; color:#b832e5; } .footer { color:#6c7587; } .tag { background:#f5f7fb; border-color:#e4e8f1; color:#5e6675; } }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" class="card" cellspacing="0" cellpadding="0" border="0">
              <tr><td class="top-bar"></td></tr>
              <tr><td class="inner">
                <h1>Verify your email</h1>
                <p>You're almost there! Tap the button below to <span class="highlight">activate your account</span> and start sharing moments.</p>
                <p style="margin-top:-4px">This link will expire in <strong>1 hour</strong> for security.</p>
                <a href="${link}" class="btn" target="_blank" rel="noopener">Verify Email</a>
                <div class="divider"></div>
                <p style="font-size:13px; margin-top:0;">Having trouble? Paste this URL in your browser:</p>
                <div class="code-box">${link}</div>
                <div class="tag">INSTACLONE SECURITY</div>
                <div class="social">
                  <a href="${facebook}" aria-label="Facebook"><img width="32" height="32" style="border-radius:6px" src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"/></a>
                  <a href="${instagram}" aria-label="Instagram"><img width="32" height="32" style="border-radius:6px" src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram"/></a>
                  <a href="${twitter}" aria-label="Twitter / X"><img width="32" height="32" style="border-radius:6px" src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter"/></a>
                </div>
                <div class="footer">If you didn't request this email you can safely ignore it.</div>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
  </html>`;
};

module.exports = { confirmEmailTemplate };
