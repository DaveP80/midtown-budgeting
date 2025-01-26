import { Form, useFetcher, useParams } from '@remix-run/react';
import { useState } from 'react'

function ExpenseData({expense_data}: {expense_data: any}) {
    const [description, setDescription] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const {id} = useParams();
    const fetcher = useFetcher();
    const totalExpense = expense_data.reduce((prev, next) => prev.amount + next.amount, 0);
    const expenseDescriptions = expense_data.map((item) => item.description);
    const expenseSubtotal = expense_data?.find((item: any) => item.description === description)?.amount || null;
    const handleChange = (e) => {
        setDescription(e.target.value);
    }

    const handleSubtotalChange = (e) => {
        setSubtotal(expenseSubtotal??0 + e.target.value);
    }
  return (
    <>
    <div>Total Expense: {totalExpense || 0}</div>
    <div>
        {description && (
            <div>
                <h3>Expense with description: {description}</h3>
                Total Expense: {expenseSubtotal}
            </div>
        )}
    </div>
    {expense_data.length > 0 && <>
        <fetcher.Form>
            <select onChange={handleChange}>
                <option key={"first"}>--dropdown--</option>
                {
                    expenseDescriptions.map((item: any, idx: number)=> {
                        return (
                            <option key={idx}>{item}</option>
                        )
                    })
                }
            </select>
        </fetcher.Form>
        { description && (
                   <Form method="post" action={`/profile/${id}/enterexpense.tsx`}>
                    <label htmlFor='description_row'>Adjust expense for: {description}</label>
                   <input type="number" min="1" name="description_row" onChange={handleSubtotalChange}/>
                   <input hidden name="running_total" value={subtotal}/>
                   <button type="submit">Enter: {subtotal}</button>
               </Form> 
        )
        }
        </>}
        <h2>Add new Expense row?</h2>
        <fetcher.Form method="post" action={`/profile/${id}/newexpense`}>
        <label htmlFor="description">description:</label>
        <input name="description" type="text" />
        <label htmlFor="amount">starting amount:</label>
        <input name="amount" type="number" min="1" />
        <button type="submit">Enter new expense line!</button>
      </fetcher.Form>  
        </>
  )
}

export default ExpenseData