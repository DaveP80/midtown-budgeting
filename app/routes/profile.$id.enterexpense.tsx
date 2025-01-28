import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { updateExpenseOnDesc } from "~/utils/queries/budget.server";

export async function action({request, params}: LoaderFunctionArgs) {
    const id = params.id;
    const data = await request.formData();
    const colDesc = data.get("description_row");
    const newAmount = data.get("subtotal");
    try {
        await updateExpenseOnDesc([id, "expenses", colDesc, newAmount]);
        return redirect(`/profile/${id}/yourdata`);
    } catch(e) {
        return redirect(`/profile/${id}/yourdata`);
    };
}

export async function loader() {
    return Response.json({ok: true});
}

export default function Index() {
    return null;
}