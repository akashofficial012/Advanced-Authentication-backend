const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const sendOtpToEmail = async (email, otp, name) => {
  try {
    const info = await transporter.sendMail({
        from: process.env.SMTP_EMAIL, // sender address
        to: email,
        subject: "OTP for email verification", // Subject line
        text: "Hello world?", // plain text body
        html: `<section style="max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; font-family: Arial, sans-serif;">
        <header style="text-align: center;">
            <a href="#"><img src="https://merakiui.com/images/full-logo.svg" alt="Meraki UI" style="height: 40px;"></a>
        </header>

        <main style="margin-top: 20px;">
            <h2 style="color: #333;">Hi ${name},</h2>
            <p style="color: #555;">This is your verification code:</p>

            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
                ${otp.split("").map(num => `<span style="display: inline-block; width: 40px; height: 40px; text-align: center; font-size: 20px; font-weight: bold; color: #007bff; border: 2px solid #007bff; border-radius: 5px;">${num}</span>`).join("")}
            </div>

            <p style="margin-top: 15px; color: #555;">
                This code will be valid for the next 5 minutes. If it doesn’t work, you can use this login verification link:
            </p>

            <div style="text-align: center; margin-top: 20px;">
                <a href="#" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            </div>

            <p style="margin-top: 20px; color: #555;">Thanks,<br>Meraki UI team</p>
        </main>

        <footer style="margin-top: 20px; text-align: center; color: #888;">
            <p>This email was sent to <a href="#" style="color: #007bff;">${email}</a>. If you’d rather not receive this, <a href="#" style="color: #007bff;">unsubscribe</a>.</p>
            <p>© ${new Date().getFullYear()} Meraki UI. All Rights Reserved.</p>
        </footer>
      </section>`, // html body
      });
    
      console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
    
  }
  }
  module.exports = {sendOtpToEmail};