import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from 'react-router';
import ExpenseData from '~/components/ExpenseData';
import IncomeData from '~/components/IncomeData';
import SummaryData from '~/components/SummaryData';
import { yourBudgetData } from '~/utils/queries/budget.server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useActionData } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { useContext } from 'react';
import { GlobalContext } from '~/context/globalcontext';

export async function action({ request }: LoaderFunctionArgs) {
    const data = await request.formData();
    const moneyInfo = data.get("bottom_line");

    const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
        generationConfig: {
            maxOutputTokens: 500
        }
    });

    const result = await model.generateContent(moneyInfo as string);
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
    const TableContext = useContext(GlobalContext);

    if (!loaderData) {
        return <FontAwesomeIcon icon={faSpinner} spin />
    }
    if (loaderData?.ok === false) {
        return <h2>A server Error Occured</h2>
    }
    const data = loaderData?.budget;
    const expenseData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "expenses") : [];
    const incomeData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "income") : [];
    const summary_data = actionData?.summary || "";

    return (
        <div className="">
            <ExpenseData expense_data={expenseData} />
            <IncomeData income_data={incomeData} />
            <SummaryData summary_data={summary_data} all_data={data || []} />
            <div className="container justify-items-stretch flex flex-col mx-auto mb-1 text-center">
                <h1 className="text-2xl font-bold mb-4">Personal Finance Data</h1>
                <div className="shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Category</th>
                                <th className="py-2 px-4">Description</th>
                                <th className="py-2 px-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {data.map((row: any, idx: number) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? "bg-gray-100" : "bg-white"}${TableContext?.rowId == row.id ? " border border-red-400" : ""}`}>
                                    <td className="py-2 px-4">{row.id}</td>
                                    <td className="py-2 px-4">{row.category}</td>
                                    <td className="py-2 px-4">{row.description}</td>
                                    <td className="py-2 px-4">{row.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}