import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

// cOnfiguration of nodemailer transporter
const transporter = nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.SMTP_KEY,
    }

})

// send email function 
export const sendEmail = async (to, message) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: message,
        html: `<body>
            <h2>${subject}</h2>
            <p>${message}!</p>
            <b>FragranceHub Mgt.</b>
        </body>`
    }
   
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);

    }catch (err){
        console.log("Error sending email", err.message);
    }
}


// send email using transporter
