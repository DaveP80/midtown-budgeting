import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import Signup from "~/components/Signup";
import { createUser } from "~/utils/queries/users.server";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    let pwdErr = false;
    let emailErr = false;
    if (email && email.length < 7) { emailErr = true };
    if (password && password.length < 5) { pwdErr = true };
    const success = (!pwdErr && !emailErr);
    if (success) {
          const result = await createUser({password, email});
          if (result?.ok) {
            return Response.json({ message: result.message });
          }
    }
    return Response.json({ pwdErr, emailErr, success, message: false });
};

export default function Index() {
    const formData = useActionData<typeof action>();
    const isPwdErr = formData?.pwdErr;
    const isEmailErr = formData?.emailErr;
    const message = formData?.message
    return <>
        <Signup errors={{ isPwdErr, isEmailErr }} message={{message}} />
    </>
}