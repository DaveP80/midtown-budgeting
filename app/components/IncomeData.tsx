import { Form, useParams } from '@remix-run/react';
import React, { useState } from 'react'

function IncomeData({income_data}: {income_data: any}) {
    const [description, setDescription] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const {id} = useParams();
    const totalIncome = income_data.reduce((prev, next) => prev.amount + next.amount, 0);
    const incomeDescriptions = income_data.map((item) => item.description);
    const incomeSubtotal = income_data.find((item: any) => item.description === description)?.amount || 0;
    const handleChange = (e) => {
        setDescription(e.target.value);
    }

    const handleSubtotalChange = (e) => {
        setSubtotal(incomeSubtotal + e.target.value);
    }
  return (
    <>
    <div>Total Income: {totalIncome}</div>
    <div>
        {description && (
            <div>
                <h3>Income with description: {description}</h3>
                Total Income: {incomeSubtotal}
            </div>
        )}
    </div>
    {income_data.length && <>
        <Form>
            <select onChange={handleChange}>
                {
                    incomeDescriptions.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined)=> {
                        return (
                            <option>{item}</option>
                        )
                    })
                }
            </select>
        </Form>
        { description && (
                   <Form method="post" action={`/profile/${id}/enterincome.tsx`}>
                    <label htmlFor='description_row'>Add some more income for: {description}</label>
                   <input type="number" min="1" name="description_row" value={subtotal} onChange={handleSubtotalChange}/>
                   <button type="submit">Enter</button>
               </Form> 
        )
        }
        </>}
        <h2>Add new Income row?</h2>
        <Form method="post" action={`/profile/${id}/newincome`}>
        <label htmlFor="description">description:</label>
        <input name="description" type="text" />
        <label htmlFor="amount">starting amout:</label>
        <input name="amount" type="number" min="1" />
        <button type="submit">Enter new income line!</button>
      </Form>  
        </>
  )
}

export default IncomeData