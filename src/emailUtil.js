import * as nodemailer from "nodemailer";
import { jsonToHTMLTable } from "./htmlUtil.js";

export const sendToMail = async (mailData, toAddress) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        name: process.env.SMTP_MAIL_SERVER_ACC,
        secureConnection: true,
        auth: {
            user: process.env.MAIL_SERVER_USER,
            pass: process.env.MAIL_SERVER_PASS
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    const subject = "Train Info for weekends of next 3 months"
    const mailOptions = await getOptions(subject, toAddress, mailData);

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

export const getOptions = async (subject, toAddress, data) => {
    let emailBody = await jsonToHTMLTable(data);;

    let mailOptions = {
        from: process.env.MAIL_FROM,
        to: toAddress,
        subject: subject,
        html: emailBody
    };
    return mailOptions;
};

// function below are no longer in use

export const getOptionsWithAttachment = async (subject, toAddress, imagePath, imageName) => {
    let emailBody = `<img style="width:250px;" cid:unique@cid>`;

    let mailOptions = {
        from: 'green_moron@proton.me',
        to: toAddress,
        subject: subject,
        text: 'Tickets for this date',
        attachments: [{
            filename: imageName,
            path: imagePath,
            cid: 'unique@cid'
        }],
        html: emailBody
    };
    return mailOptions;
};