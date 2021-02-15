import nodemailer from 'nodemailer';

 // process.env.NODEMAILER_USERNAME, NODE_MAILER_HOST,NODE_MAILER_PORT
        // process.env.NODEMAILER_PASSWORD

// @ts-ignore
export const transport = nodemailer.createTransport({
    host: process.env.NODE_MAILER_HOST,
    port: 2525,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD
    }
});