const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.gmail_user,
        pass: process.env.gmail_app_password
    }
});

async function sendPasswordResetEmail(email, resetLink) {

    await transporter.sendMail({
        from: `"MovieFlick" <${process.env.gmail_user}>`,
        to: email,
        subject: "MovieFlick - Password Reset",
        text: `You requested a password reset for your MovieFlick account.

Click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.`,

        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">

                <h2 style="color: #e50914;">
                    MovieFlick Password Reset
                </h2>

                <p>
                    You requested a password reset for your MovieFlick account.
                </p>

                <p>
                    Click the button below to create a new password:
                </p>

                <div style="margin: 30px 0;">
                    <a
                        href="${resetLink}"
                        style="
                            display: inline-block;
                            padding: 12px 22px;
                            background: #e50914;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                        "
                    >
                        Reset Password
                    </a>
                </div>

                <p>
                    This link will expire in <strong>15 minutes</strong>.
                </p>

                <p style="color: #666666;">
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <hr style="margin-top: 30px; border: none; border-top: 1px solid #eeeeee;">

                <p style="color: #999999; font-size: 12px;">
                    MovieFlick
                </p>

            </div>
        `
    });
}

module.exports = {
    sendPasswordResetEmail
};