import bcrypt from "bcryptjs";
import { db } from "../render.server.ts";
import nodemailer from "nodemailer";

import { UserAlreadyExistsError, EmailHostError, PasswordError, AuthError } from "../lib/customErrors.ts";

const htmlPasswordChangeContent = `
  <html>
    <body>
      <h3>Your password has been changed</h3>
      <p>There was a change on the password for the user with this email address: $(user_email)</p>
    </body>
  </html>
`;

export const changePassword = async (args: any[]) => {
    try {

        let salt = await bcrypt.genSalt(10);

        let hashedPassword = await bcrypt.hash(args[1], salt);
        args.push(hashedPassword);
        const newPwd = await db.any(`update users set password = $3 where id = $1 returning*`, args);
        if (newPwd.length) {
            await sendPasswordNotification(newPwd[0].email);
            return { message: "updated with new password and sent email", ok: true };
        } else {
            return { message: "failed to updated users row on password change", ok: false };
        }
    } catch (e) {
        throw e;
    }
};

const sendPasswordNotification = async(email: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_ADD,
                pass: process.env.PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ADD,
            to: email,
            subject: "An attempt was made to login to your account",
            html: htmlPasswordChangeContent
                .replace(
                    "$(user_email)",
                    email
                )
        };
        await transporter.sendMail(mailOptions);
    } catch(e) {
        throw e;
    }
}