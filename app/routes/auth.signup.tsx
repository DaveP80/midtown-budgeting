import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Signup from "~/components/Signup";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let pwdErr = false;
    let emailErr = false;
    if (email && email.length < 7) { emailErr = true };
    if (password && password.length < 5) { pwdErr = true };
    const success = (!pwdErr && !emailErr);
    return Response.json({ pwdErr, emailErr, success });
};

export default function Index() {
    const formData = useActionData<typeof action>();
    const isPwdErr = formData?.pwdErr;
    const isEmailErr = formData?.emailErr;
    return <>
        <Signup errors={{ isPwdErr, isEmailErr }} />
    </>
}