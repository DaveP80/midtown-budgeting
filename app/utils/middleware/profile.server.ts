import bcrypt from "bcryptjs";
import { db } from "../render.server.ts";
import { PasswordError, UserNotFoundError } from "../lib/customErrors.js";
export async function checkOldPassword(args: any[]) {
    try {
        const foundUserAndPwd = await db.any(
            `select
          id,
          email,
          password from users where id = $1`,
            args
        );
        if (!foundUserAndPwd.length) {
            throw new UserNotFoundError("Id not associated with known user.");
        } else {
            let user = foundUserAndPwd[0];
            let comparedPassword = await bcrypt.compare(args[1], user.password);

            if (!comparedPassword) {
                throw new PasswordError(
                    "Please try a different password",
                    "user password change error",
                );
            }
            if (comparedPassword) {
                return true;
            }
        }
    } catch (error) {
        throw(error);
    }
}