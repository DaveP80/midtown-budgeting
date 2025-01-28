import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { makeBudgetTables } from "~/utils/queries/budget.server";

export async function loader({ params }: ActionFunctionArgs) {
    const id = params?.id || "";
    try {
        await makeBudgetTables(id);
        return redirect(`/profile/${id}/yourdata`);
    } catch (e: any) {
        return redirect(`/auth`)
    }
}