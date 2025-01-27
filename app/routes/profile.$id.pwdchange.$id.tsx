import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useContext } from "react";
import ChangePwd from "~/components/ChangePwd";
import { GlobalContext } from "~/context/globalcontext";
import { checkOldPassword } from "~/utils/middleware/profile.server";
import { changePassword } from "~/utils/queries/profile.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const old_password = formData.get('old_password') as string;
  const new_password = formData.get('new_password') as string;
  const id = params.id;
  let pwdErr = false;
  let pwdStrengthErr = false;
  let emailErr = false;
  if (new_password && new_password.length < 8) { pwdErr = true };
  if (new_password && !pwdErr) {
    pwdStrengthErr = !/[A-Z]/.test(new_password);
  }
  const success = !pwdErr && !pwdStrengthErr;
  if (success && id) {
    try {
      await checkOldPassword([id, old_password]);
      const result = await changePassword([id, new_password]);
      if (result?.ok) {
        return Response.json({ message: result.message, ok: true });
      } else {
        return Response.json({ message: "Please retry with your old password and new password", id: -1, ok: false });
      }
    }
    catch (e: unknown) {
      return Response.json({ message: e?.message, ok: false })
    }
  }
  return Response.json({ pwdErr, pwdStrengthErr, emailErr, success, message: false });
};

export default function Index() {
  const formData = useActionData<typeof action>();
  const UserContext = useContext(GlobalContext);
  const isPwdErr = formData?.pwdErr;
  const message = formData?.message;
  const pwdStrengthErr = formData?.pwdStrengthErr;
  const ok = formData?.ok;
  const id = UserContext?.user?.id || -1;
  return (
    <ChangePwd errors={{ isPwdErr, pwdStrengthErr }} status={{ message, id, ok }} />
  )
}