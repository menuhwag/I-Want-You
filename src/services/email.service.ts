import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';
import { ConfigType } from '@nestjs/config';


interface EmailOption {
    to: string;
    subject: string;
    html: string;
}

@Injectable()
export class EmailService {
    private transporter: Mail;

    constructor(
        @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>
    ) {
        this.transporter = nodemailer.createTransport({
            service: config.service,
            auth: {
                user: config.auth.user,
                pass: config.auth.pass
            }
        });
    }

    async sendVerification(email: string, verifyToken: string) {
        const baseUrl = this.config.baseurl;

        const url = `${baseUrl}/users/email-verify?verifyToken=${verifyToken}`;
        const mailOptions: EmailOption = {
            to: email,
            subject: '가입 인증 메일',
            html: `
                가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
                <form action="${url}" method="POST">
                <button>가입확인</button>
                </form>
            `
        }

        return await this.transporter.sendMail(mailOptions);
    }
}
