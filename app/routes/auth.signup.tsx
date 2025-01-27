import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Signup from "~/components/Signup";
import { createUser } from "~/utils/queries/users.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let pwdErr = false;
    let pwdStrengthErr = false;
    let emailErr = false;
    if (email && email.length < 7) { emailErr = true };
    if (password && password.length < 8) { pwdErr = true };
    //Test if password includes at least 1 uppercase.
    if (password && !pwdErr) {
        pwdStrengthErr = !/[A-Z]/.test(password);
    }
    const success = (!pwdErr && !pwdStrengthErr && !emailErr);
    if (success) {
        try {
            const result = await createUser({ password, email });
            if (result?.ok) {
                return Response.json({ message: result.message });
            }
        } catch (e: any) {
            return Response.json({ pwdErr, pwdStrengthErr, emailErr, message: e.message });
        }
    }
    return Response.json({ pwdErr, emailErr, pwdStrengthErr, message: false });
};

export default function Index() {
    const formData = useActionData<typeof action>();
    const isPwdErr = formData?.pwdErr;
    const isEmailErr = formData?.emailErr;
    const pwdStrengthErr = formData?.pwdStrengthErr;
    const message = formData?.message
    return  (
        <Signup errors={{ isPwdErr, pwdStrengthErr, isEmailErr }} message={{ message }} />
    )
}