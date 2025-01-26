import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { confirmCode } from "~/utils/queries/users.server";

export async function action({ request, params }: ActionFunctionArgs) {
    const data = await request.formData();
    const id = params.id;
    const Code = data.get("Code") as string;
    try {
        const resultOfCode = await confirmCode([id, Code]);
        if (resultOfCode?.ok) {
            return redirect(`/profile/${resultOfCode.id}`);
        } else {
            return Response.json({ ok: false, message: resultOfCode.message })
        }
    } catch (e: any) {
        return Response.json({ error: e?.message, message: "Something went wrong" })
    }
}

export async function loader() {
    return Response.json({ status: 200 });
};

export default function Index(){
    const actionData = useActionData<typeof action>();

    if (actionData?.message) {
        return <>{actionData.message}</>
    }

    return <>...Verifying</>;
}