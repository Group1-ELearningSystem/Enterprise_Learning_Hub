import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nhtetien@gmail.com",
        pass: "mrzm pjaa pqvn ysqv"
    }
})

export async function sendEmail(email, subject, text){
    await transporter.sendMail({
        from: '"E-Learning System" <your_email@gmail.com>',
        to: email,
        subject: subject,
        text: text
    });
}