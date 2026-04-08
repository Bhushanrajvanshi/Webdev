import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    try {
        // Create a transporter object using the default SMTP transport
        const transprter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Send mail with defined transport object
        const mailOptions = transprter.sendMail({
            from: "AUTHENTICATION SYSTEM",
            to: `${email}`,
            subject: `${subject}`,
            text: `${text}`,
        });

        return mailOptions;
    } catch (error) {
        console.error("Error sending email: ", error.message);
    }
}