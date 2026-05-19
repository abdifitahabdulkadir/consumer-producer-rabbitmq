import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'camila.effertz@ethereal.email',
      pass: 'EFBQK4evr3bRrnFDjC',
    },
  });

  async sendEmaillink({ token, email }: { token: string; email: string }) {
    const resetPageLink = `http://localhost:300/reset-passwrod?token=${token}`;
    await this.transporter.sendMail({
      from: 'Abdifitah Authenticaiton',
      subject: 'Regarding Reset Password',
      to: email,
      html: `<p>You have request to to reset your passwrod Click the link: <a href="${resetPageLink}" >Reset Link</a> you can safely ignore if this was not you. </p>`,
    });
  }
}
