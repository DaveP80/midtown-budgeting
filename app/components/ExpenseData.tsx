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
        <>
            <div>
                {descriptions && (
                    <div>
                        <div>Total Expenses across all descriptions: {TotalExpense}</div>
                        <h3>Expense with description: {description}, Total Expense: {foundMatches ? foundMatches.amount : 0}</h3>
                    </div>
                )}
            </div>
            {expense_data.length > 0 && <>
                <fetcher.Form>
                    <select onChange={handleChange}>
                        {
                            descriptions.map((item: any, idx: number) => {
                                return (
                                    <option key={idx}>{item}</option>
                                )
                            })
                        }
                    </select>
                </fetcher.Form>
                {description && (
                    <fetcher.Form method="post" action={`/profile/${id}/enterexpense`}>
                        <label htmlFor='description_row'>Increase the expense for: {description}</label>
                        <input type="hidden" name="description_row" readOnly value={description} />
                        <input type="text" name="description_row" onChange={handleSubtotalChange} required pattern="-?[0-9]*" placeholder='1'/>
                        <input type="hidden" name="subtotal" readOnly value={subtotal || 0} />
                        <button type="submit">Enter: {subtotal}</button>
                    </fetcher.Form>
                )
                }
            </>}
            <h2>Add new Expense row?</h2>
            <fetcher.Form method="post" action={`/profile/${id}/newexpense`}>
                <label htmlFor="description">description:</label>
                <input name="description" type="text" />
                <label htmlFor="amount">starting expense amount:</label>
                <input name="amount" type="text" required pattern="[0-9]*" />
                <button type="submit">Enter new expense line!</button>
            </fetcher.Form>
        </>
    )
}

export default ExpenseData