import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nhtetien@gmail.com",
        pass: "mrzm pjaa pqvn ysqv"
    }
})

export async function sendVerificationEmail(email, code){
    await transporter.sendMail({
        from: '"E-Learning System" <your_email@gmail.com>',
        to: email,
        subject: "Email Verification Code",
        text: `Your verification code is: ${code}`
    });

}