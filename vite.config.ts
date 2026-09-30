import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import nodemailer from 'nodemailer';

function smtpOtpPlugin(): Plugin {
  const otpStore = new Map<string, { code: string; expiresAt: number }>();

  return {
    name: 'smtp-otp-service',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Endpoint 1: Send OTP via SMTP
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { email } = JSON.parse(body || '{}');
              const cleanEmail = (email || '').trim().toLowerCase();

              if (!cleanEmail || !cleanEmail.includes('@')) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Valid email is required.' }));
              }

              // Generate 6-digit numeric OTP
              const code = Math.floor(100000 + Math.random() * 900000).toString();
              otpStore.set(cleanEmail, {
                code,
                expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes validity
              });

              const env = loadEnv('development', process.cwd(), '');
              const host = env.SMTP_HOST || env.MAIL_HOST || 'smtp.gmail.com';
              const port = Number(env.SMTP_PORT || env.MAIL_PORT) || 587;
              const user = env.SMTP_USER || env.MAIL_USERNAME || 'gowthamvignesh270@gmail.com';
              const rawPass = env.SMTP_PASS || env.MAIL_PASSWORD || 'nwrn gysh muwl iyoi';
              const pass = rawPass.replace(/["']/g, '');
              const fromName = (env.SMTP_FROM_NAME || env.MAIL_FROM_NAME || 'SYNCID Support').replace(/["']/g, '');
              const fromEmail = env.SMTP_FROM_EMAIL || env.MAIL_FROM_ADDRESS || user;

              const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
                connectionTimeout: 10000
              });

              await transporter.sendMail({
                from: `"${fromName}" <${fromEmail}>`,
                to: cleanEmail,
                subject: `Your SYNCID Verification Code: ${code}`,
                text: `Hello,\n\nYour SYNCID verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nThank you,\nSYNCID Support Team`,
                html: `
                  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 14px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 20px;">
                      <h2 style="margin: 0; color: #0f172a; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">SYNCID <span style="font-size: 14px; font-weight: 500; color: #64748b;">Verification</span></h2>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                      Please enter the verification code below to verify your email and complete your customer ticket request:
                    </p>
                    <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
                      <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">${code}</div>
                      <div style="color: #64748b; font-size: 12px; margin-top: 6px; font-weight: 500;">Valid for 10 minutes</div>
                    </div>
                    <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">
                      If you did not request this verification code, please ignore this email.
                    </p>
                  </div>
                `
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'OTP sent successfully' }));
            } catch (err: any) {
              console.error('SMTP Send Error:', err?.message || err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Failed to dispatch email' }));
            }
          });
          return;
        }

        // Endpoint 2: Verify OTP
        if (req.url === '/api/verify-otp' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { email, token } = JSON.parse(body || '{}');
              const cleanEmail = (email || '').trim().toLowerCase();
              const cleanToken = (token || '').trim();

              const record = otpStore.get(cleanEmail);
              if (!record) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'No verification code found for this email. Please request a code.' }));
              }

              if (Date.now() > record.expiresAt) {
                otpStore.delete(cleanEmail);
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Verification code has expired. Please request a new code.' }));
              }

              if (record.code !== cleanToken) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: 'Incorrect verification code. Please check your email and try again.' }));
              }

              // Verification successful
              otpStore.delete(cleanEmail);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: err?.message || 'Verification failed' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    smtpOtpPlugin()
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  }
});

