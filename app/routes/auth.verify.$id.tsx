import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { confirmCode } from "~/utils/queries/users.server";

export async function action({request, params}: ActionFunctionArgs) {
    const data = await request.formData();
    const id = params.id;
    const Code = data.get("Code") as string;
    try {
        const resultOfCode = await confirmCode([id, Code]);
        if (resultOfCode?.ok) {
            throw redirect("/profile");
        } else {
            return Response.json({ok: false, message: resultOfCode.message}) 
        }
    } catch(e: any) {
        return Response.json({error: e?.message, message: "Something went wrong"})
    }
}