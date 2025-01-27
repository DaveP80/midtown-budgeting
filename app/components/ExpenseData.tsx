import { useFetcher, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react'

function ExpenseData({ expense_data }: { expense_data: any }) {
    const [description, setDescription] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const { id } = useParams();
    const fetcher = useFetcher();
    const [descriptions, setDescriptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchedDescriptions = expense_data.map((item: any) => item.description);
        setDescriptions(fetchedDescriptions);
        if (fetchedDescriptions.length > 0) {
            setDescription(fetchedDescriptions[0]);
        }

    }, [expense_data]);

    const handleChange = (e: any) => {
        setDescription(e.target.value);
    }

    const handleSubtotalChange = (e: any) => {
        const initValue = expense_data?.length > 0 ? expense_data.find(item => item.description === description)?.amount || 0 : 0;
        setSubtotal(+e.target.value + +initValue);
    }
    const foundMatches = expense_data?.length > 0 ? expense_data.find(item => item.description === description) : null;
    let TotalExpense = 0;
    if (expense_data?.length > 0) {
        for (let n of expense_data) {
            TotalExpense += Number(n.amount);
        }
    }

    return (
        <div className="bg-gray-50 flex flex-col md:m-4 xs:m-1 rounded shadow-md border border-blue-500">
            <div className="text-center mb-4">
                {descriptions && (
                    <div>
                        <h3 className="text-gray-700">Total Expenses across all descriptions: {TotalExpense}</h3>
                        <h3 className="text-blue-700">Expense with description: {description}, Total Expense: {foundMatches ? foundMatches.amount : 0}</h3>
                    </div>
                )}
            </div>
            {expense_data.length > 0 && (
                <div className="mx-auto">
                    <fetcher.Form className="mb-4">
                        <select onChange={handleChange} className="border border-gray-300 rounded-md p-2">
                            {descriptions.map((item: any, idx: number) => (
                                <option key={idx}>{item}</option>
                            ))}
                        </select>
                    </fetcher.Form>
                    {description && (
                        <fetcher.Form method="post" action={`/profile/${id}/enterexpense`} className="mb-4">
                            <label htmlFor='description_row' className="block mb-2">Change the expense for: {description}</label>
                            <input type="hidden" name="description_row" readOnly value={description}  />
                            <input type="text" name="incrementer" onChange={handleSubtotalChange} required pattern="-?[0-9]*" placeholder='1' className="border border-gray-300 rounded-md p-2 mr-2" />
                            <input type="hidden" name="subtotal" readOnly value={subtotal || 0}  />
                            <button name="enter_expense_btn" type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md">Enter: {subtotal}</button>
                        </fetcher.Form>
                    )}
                </div>
            )}
            <div className="mx-auto">
                <div className="text-center">
                    <h2 className="text-dark mb-2">Add new Expense row?</h2>
                </div>
                <fetcher.Form method="post" action={`/profile/${id}/newexpense`} className="mb-4">
                    <label htmlFor="description" className="block mb-2">Description:</label>
                    <input name="description" type="text" className="border border-gray-300 rounded-md p-2 mb-2" placeholder="rent"/>
                    <label htmlFor="amount" className="block mb-2">Starting expense amount:</label>
                    <input name="amount" type="text" required pattern="[0-9]*" className="border border-gray-300 rounded-md p-2 mb-2" placeholder="0"/>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Enter new expense line!</button>
                </fetcher.Form>
            </div>
        </div>
    )
}

export default ExpenseData