// utils/emailUtils.js

const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function sendVerificationEmail(user) {
    const verificationCode = user.emailVerificationCode;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user.email, // Thay bằng địa chỉ email của bạn
            pass: 'bsut seml phtg kxix', // Thay bằng mật khẩu email của bạn hoặc mã ứng dụng
        },
    });

    const mailOptions = {
        from: user.email, // Thay bằng địa chỉ email của bạn
        to: user.email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, generateVerificationCode };