import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { makeBudgetTables } from "~/utils/queries/budget.server";

export async function loader({ request, params }: ActionFunctionArgs) {
    const id = params?.id || "";
    try {
        await makeBudgetTables(id);
            return redirect(`/profile/${id}/youdata`);
    } catch (e: any) {
       return redirect(`/profile/${id}`) 
    }
}