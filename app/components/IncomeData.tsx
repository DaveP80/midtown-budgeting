import { Form, useFetcher, useParams } from '@remix-run/react';
import { useEffect, useState } from 'react'

function IncomeData({ income_data }: { income_data: any }) {
    const [description, setDescription] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const { id } = useParams();
    const fetcher = useFetcher();
    const [descriptions, setDescriptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchedDescriptions = income_data.map((item: any) => item.description);
        setDescriptions(fetchedDescriptions);
        if (fetchedDescriptions.length > 0) {
            setDescription(fetchedDescriptions[0]);
        }

    }, [income_data]);

    const handleChange = (e) => {
        setDescription(e.target.value);
    }

    const handleSubtotalChange = (e) => {
        const initValue = income_data?.length > 0 ? income_data.find(item => item.description === description)?.amount || 0 : 0;
        setSubtotal(+e.target.value + +initValue);
    }
    const foundMatches = income_data?.length > 0 ? income_data.find(item => item.description === description) : null;
    let TotalIncome = 0;
    if (income_data?.length > 0) {
        for (let n of income_data) {
            TotalIncome += Number(n.amount);
        }
    }

    return (
        <>
            <div>
                {descriptions && (
                    <div>
                        <div>Total Income across all descriptions: {TotalIncome}</div>
                        <h3>Income with description: {description}, Total Income: {foundMatches ? foundMatches.amount : 0}</h3>
                    </div>
                )}
            </div>
            {income_data.length > 0 && <>
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
                    <Form method="post" action={`/profile/${id}/enterincome`}>
                        <label htmlFor='description_row'>Add some more income for: {description}</label>
                        <input type="hidden" name="description_row" readOnly value={description} />
                        <input type="number" min="1" name="description_row" onChange={handleSubtotalChange} />
                        <input type="hidden" name="subtotal" readOnly value={subtotal || 0} />
                        <button type="submit">Enter: {subtotal}</button>
                    </Form>
                )
                }
            </>}
            <h2>Add new Income row?</h2>
            <fetcher.Form method="post" action={`/profile/${id}/newincome`}>
                <label htmlFor="description">description:</label>
                <input name="description" type="text" />
                <label htmlFor="amount">starting amount:</label>
                <input name="amount" type="number" min="1" />
                <button type="submit">Enter new income line!</button>
            </fetcher.Form>
        </>
    )
}

export default IncomeData