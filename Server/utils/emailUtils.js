// utils/emailUtils.js

const nodemailer = require('nodemailer');
const crypto = require('crypto');

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function sendVerificationEmail(user, text) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SEND_NODEMAILER,
            pass: process.env.PASSWORD_SEND_NODEMAILER,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_SEND_NODEMAILER,
        to: user.email,
        subject: 'Email Verification',
        html: text,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, generateVerificationCode };