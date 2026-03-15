import { Resend } from 'resend';

export const sendWelcomeEmail = async (email, name = "there") => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Error: RESEND_API_KEY is missing in .env");
      return;
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'Chatify Team <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to Chatify! 💬',
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f9; }
                    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 40px 20px; text-align: center; color: white; }
                    .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .content { padding: 40px; color: #334155; line-height: 1.8; }
                    .button-container { text-align: center; margin: 30px 0; }
                    .button { background-color: #2563eb; color: #ffffff !important; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; }
                    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">💬 Chatify</div>
                        <h1>Welcome Aboard!</h1>
                        <p>Real-time conversations, simplified.</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${name},</h2>
                        <p>We are absolutely thrilled to have you join <strong>Chatify</strong>! Our mission is to connect you with the people who matter most, through a seamless and beautiful interface.</p>
                        <p>Your account is now active. Click the button below to dive in and start your first conversation!</p>
                        <div class="button-container">
                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="button">Get Started Now</a>
                        </div>
                        <p>If you have any questions, simply reply to this email. We're here to help!</p>
                        <p>Cheers,<br><strong>The Chatify Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Chatify App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `
    });

    if (error) throw error;
    console.log("Professional Email sent successfully!");
    return data;
  } catch (err) {
    console.error("Email error:", err.message);
  }
};