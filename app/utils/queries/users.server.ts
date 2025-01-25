import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../render.server.ts";
import nodemailer from "nodemailer";

import { UserAlreadyExistsError, EmailHostError, PasswordError, AuthError } from "../lib/customErrors.ts";


const htmlContent = `
  <html>
    <body>
      <h3>Hello, New User!</h3>
      <a href="$(url)" target="_blank">Confirm your Account</a>
    </body>
  </html>
`;

const htmlLoginContent = `
  <html>
    <body>
      <h3>Hello, World!</h3>
      <p>Please Use this Secret Key: $(secret_code)</p>
    </body>
  </html>
`;

const htmlWarningContent = `
  <html>
    <body>
      <h3>If you just made this attempt, you can ignore.</h3>
      <p>Sorry, there was an unsuccessful attempt to login to the budgeting app with this email address: $(user_email)</p>
    </body>
  </html>
`;

const getAllUsers = async () => {
    try {
        const allUsers = await db.any("SELECT * FROM users");

        return allUsers;
    } catch (e) {
        throw e;
    }
};

const createUser = async (data) => {
    const { password, email } = data;

    let salt = await bcrypt.genSalt(10);

    let hashedPassword = await bcrypt.hash(password, salt);

    try {
        const checkLogs = await db.any(
            `select * from auth_users where user_email ilike $1`,
            [email],
        );
        if (checkLogs[0]) {
            throw new UserAlreadyExistsError(
                `Cannot register with a previously used email: ${email}`,
            );
        }
        const res = await db.any(
            `insert into users(email, password) values ($1, $2) returning *`,
            [email, hashedPassword],
        );

        if (res[0]) {
            let jwtToken = jwt.sign(
                {
                    email,
                    id: res[0]["id"],
                },
                process.env.JWT_TOKEN_SECRET_KEY!,
                { expiresIn: "7d" },
            );

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
                subject: "welcome and confirm",
                html: htmlContent
                    .replace(
                        "$(url)",
                        process.env.NODE_ENV === "development"
                            ? `http://localhost:5173/auth/confirmation?k=${jwtToken}`
                            : `https://midtown-personal-34570864936.us-east1.run.app/auth/confirmation?k=${jwtToken}`,
                    )
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
            return { message: `Email sent to ${email} successfully`, ok: true };
        } else {
            throw new EmailHostError(`Email host server error`);
        }
    } catch (error) {
        if (
            error instanceof UserAlreadyExistsError ||
            error instanceof EmailHostError
        ) {
            throw error;
        } else
            throw new UserAlreadyExistsError(
                `User with email ${email} already exists.`,
            );
    }
};

const login = async (data: Record<string, string>) => {
    const { email, password } = data;
    let randomNumber;

    const foundUser = await db.any(
        `select
      id,
      email,
      password from users where email = $1 and is_auth = true`,
        email,
    );

    if (foundUser.length === 0) {
        throw new PasswordError("Invalid email address", "user login error");
    } else {
        let user = foundUser[0];
        let comparedPassword = await bcrypt.compare(password, user.password);

        if (!comparedPassword) {
            throw new PasswordError(
                "Please check your email and password",
                "login credential error",
            );
        }
        if (comparedPassword) {

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
                subject: "This login code is for you",
                html: htmlLoginContent
                    .replace(
                        "$(secret_code)",
                        () => {
                            const min = 1000;
                            const max = 9999;
                            randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                            return randomNumber.toString();
                        }
                    )
            };

            await transporter.sendMail(mailOptions);
            const insertSecret = await db.any(
                `insert into auth_logins(user_id, secret_code) values ($1, $2) returning *`,
                [user.id, randomNumber],
            );
            if (insertSecret) {
                return {
                    message: `Welcome Back`,
                    id: insertSecret[0].id,
                    ok: true
                };
            } else {
                return {
                    message: "unable to insert secret code",
                    id: -1,
                    ok: false
                }
            }
        } else {
            throw new EmailHostError(`Email host server error`);
        }
    }
};
//when a user clicks on email confirmation link
const authLogin = async (decodedToken: Record<string, string> | string) => {
    try {
        const auUser = await db.any(
            //set users is_auth to true
            `Update users set is_auth = true where id in (select id from users where id=$1 and is_auth=false) returning *`,
            decodedToken?.id,
        );
        if (auUser.length === 0) {
            throw new AuthError(`Invalid id: ${decodedToken.id}`);
        } else {
            let sqlArr = auUser[0];
            return sqlArr;
        }
    } catch (e: any) {
        if (e instanceof AuthError) {
            throw e;
        } else throw { message: "server error", error: e.name, status: 500 };
    }
};
//For a user to login, 4 digit confirm code with storage.
const confirmCode = async (args: any[]) => {
    try {
        const foundCode = await db.any(`select * from auth_logins al join users u on al.user_id = u.id where secret_code = $2 and al.id = $1`, args);
        if (foundCode.length) {
            //Clean up secret code table for future attempts.
            const cleanUpCode = await db.any(`delete from auth_logins where id = $1`, args);
            if (cleanUpCode) {
                return { message: "success", id: foundCode[0].user_id, ok: true };
            } else {
                return { message: "failure to complete auth, sql server error", ok: false, status: 500 }
            }
        }
        else {
            await notifyOfBadCode(args);
            return { message: "failure to verify code, try again", ok: false };
        }
    } catch (e) {
        throw {
            error: e.name,
            message: e.message,
            status: 500,
        }
    }
}

const notifyOfBadCode = async (args: any[]) => {
    try {
        const result = await db.any(`select user_id, email from auth_logins al join users u on al.user_id = u.id where al.id = $1`, args);
        if (result) {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_ADD,
                    pass: process.env.PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_ADD,
                to: result[0].email,
                subject: "An attempt was made to login to your account",
                html: htmlWarningContent
                    .replace(
                        "$(user_email)",
                        result[0].email
                    )
            };
            await transporter.sendMail(mailOptions);
            return { message: "user was notified of attempt", ok: true }
        }
        else {
            return { message: "sql logic error", ok: false }
        }
    } catch {
        throw new EmailHostError(`Email host server error`);
    }
}
//user profile information
const getInfo = async (args) => {
    try {
        const userJoin = await db.any(
            `select
      c.id,
      c.email,
      c.password,
      au.all_is_auth
    from
      (
      select
        *
      from
        users
      where
        id = $1) c
    join auth_users au on
      c.id = au.user_id where id = $1`,
            args,
        );
        if (userJoin.length === 0) {
            throw new Error();
        } else {
            return { ...userJoin[0] };
        }
    } catch (e) {
        throw {
            error: e.name,
            message: e.message,
            status: 500,
        };
    }
};

const getByEmail = async (email) => {
    try {
        const result = await db.any(
            `select
      email
    from
      user
    where
      email ilike $1
    union
           select
      user_email
    from
      auth_users
    where
      user_email ilike $1`,
            email,
        );
        return result;
    } catch (e) {
        throw e;
    }
};

export {
    getAllUsers,
    createUser,
    login,
    authLogin,
    getInfo,
    confirmCode,
    getByEmail,
};


