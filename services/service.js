const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const welcome = async (toEmail, name) => {
    const mailSender = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Welcome to my back_end application',
        html: 
            `<h1>Hi! ${name} Welcome thank you for registering my application</h1>
            <p>this message is authomatically send for our user registrations only</p>`
    }

    await transporter.sendMail(mailSender)
}

const forgotPass = async (toEmail, resetLink) => {
    const mailSender = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Password Reset',
        message: `Good day you successfully reset your password!
                here is your password reset link: ${resetLink}`
    }
}


module.exports = {
    welcome,
    forgotPass
}