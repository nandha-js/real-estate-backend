const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use SendGrid or other production SMTP here
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // For development (Mailtrap)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    try {
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText.convert(html),
      };

      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      console.error('❌ Email sending failed:', err);
      throw err;
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Real Estate Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
