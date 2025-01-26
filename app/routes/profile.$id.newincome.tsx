import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { enterNewIncomeDesc } from "~/utils/queries/budget.server";

export async function action({request, params}: LoaderFunctionArgs) {
    const id = params.id;
    const data = await request.formData();
    const newDesc = data.get("description");
    const newAmount = data.get("amount");
    try {
        await enterNewIncomeDesc([id, "income", newDesc, newAmount]);
        return redirect(`/profile/${id}/yourdata`);
    } catch(e) {
        return redirect(`/profile/${id}/yourdata`)
    };
}

export async function loader() {
    return Response.json({ok: true});
}

export default function Index() {
    return null;
}