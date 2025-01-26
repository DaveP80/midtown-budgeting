import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from 'react-router';
import ExpenseData from '~/components/ExpenseData';
import IncomeData from '~/components/IncomeData';
import SummaryData from '~/components/SummaryData';
import { yourBudgetData } from '~/utils/queries/budget.server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useActionData } from '@remix-run/react';

export async function action({ request }: LoaderFunctionArgs) {
    const data = await request.formData();
    const moneyInfo = data.get("bottom_line");

    const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `My income and expense bottom line is ${moneyInfo} is this good from a budgeting perspective?`;

    const result = await model.generateContent(prompt);
    return Response.json({ summary: result.response.text(), ok: true });
}

export async function loader({ params }: LoaderFunctionArgs) {
    try {
        let tableData = await yourBudgetData(params.id || "");
        return Response.json(tableData);
    } catch (e) {
        return Response.json({ data: null, ok: false, status: 500 });
    }

};

export default function PersonalFinanceRoute() {
    const loaderData = useLoaderData();
    const actionData = useActionData<typeof action>();

    if (!loaderData) {
        return <div className="div">...Loading</div>
    }
    if (loaderData?.ok === false) {
        return <>A server Error Occured</>
    }
    const data = loaderData?.budget;
    const expenseData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "expenses") : [];
    const incomeData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "income") : [];
    const summary_data = actionData?.summary || "";

    return (
        <>
            <ExpenseData expense_data={expenseData} />
            <IncomeData income_data={incomeData} />
            <SummaryData summary_data={summary_data} all_data={data || []} />
            <div>
                <h1>Personal Finance Data</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row: any, idx: number) => (
                            <tr key={idx}>
                                <td>{row.id}</td>
                                <td>{row.category}</td>
                                <td>{row.description}</td>
                                <td>{row.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}