const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground" // Redirect URL
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    // accessToken: oauth2Client.getAccessToken()
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend with Bhushan" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail, userName) {
    const subject = 'Welcome to Backend Practice with Bhushan'
    const text = `
        Hello ${userName},
        Thank you for registering with Backend Practice with Bhushan \n 
        We're excited to have you onboard! \n
        If you have any questions or need assistance, feel free to reach out to us.\n
        Happy coding!`
    const html = `
        <p>Hello ${userName},</p>
        <p>Thank you for registering with <b>Backend Practice with Bhushan</b></p>
        <p>We're excited to have you onboard!</p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <p>Happy coding!</p>
    `   
    await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionEmail(userEmail, name, amount, toAccount){
    const subject = 'Transaction Successful!';
    const text = `Hello ${name},
      Your transaction of $${amount} to account ${toAccount} was successful.
      Thank you for using our service!`;
    const html = `
        <p>Hello ${name},</p>
        <p>Your transaction of <b>$${amount}</b> to account <b>${toAccount}</b> was successful.</p>
        <p>Thank you for using our service!</p>
    `
    await sendEmail(userEmail, subject, text, html);
}


async function sendFailedTransactionEmail(userEmail, name, amount, toAccount){
    const subject = 'Transaction Failed';
    const text = `Hello ${name},
      Unfortunately, your transaction of $${amount} to account ${toAccount} has failed.
      Please check your account balance and try again. If the issue persists, contact our support team.`;
    const html = `
        <p>Hello ${name},</p>
        <p>Unfortunately, your transaction of <b>$${amount}</b> to account <b>${toAccount}</b> has failed.</p>
        <p>Please check your account balance and try again. If the issue persists, contact our support team.</p>
    `
    await sendEmail(userEmail, subject, text, html);
}



// module.exports = transporter;
module.exports = { sendRegistrationEmail, sendTransactionEmail, sendFailedTransactionEmail };