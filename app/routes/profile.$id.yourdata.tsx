import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from 'react-router';
import { yourBudgetData } from '~/utils/queries/budget.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
    try {
        let tableData = await yourBudgetData(params.id || "");
        return Response.json(tableData);
    } catch (e) {
        return Response.json({ data: null, ok: false, status: 500 });
    }

};

export default function PersonalFinanceRoute() {
    const loaderData = useLoaderData();
    if (!loaderData) {
        return <div className="div">...Loading</div>
    }
    if (loaderData?.ok === false) {
        return <>A server Error Occured</>
    }
    const data = loaderData?.budget;
    const expenseData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "expense") : [];
    const incomeData = loaderData?.budget ? loaderData.budget.filter(item => item.category === "income") : [];



    return (
        <>
            <ExpenseData expense_data={expenseData} />
            <IncomeData income_data={incomeData} />

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