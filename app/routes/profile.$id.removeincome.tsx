import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { deleteFromIncome } from "~/utils/queries/budget.server";

export async function action({request, params}: LoaderFunctionArgs) {
    const id = params.id;
    try {
        const selected = await request.formData();
        const toDelete = selected.get("income_item")
        if (toDelete)
        await deleteFromIncome([id, toDelete]);
        return redirect(`/profile/${id}/yourdata`);
    } catch(e) {
        console.error(e)
    };
    return redirect(`/profile/${id}/yourdata`)
}