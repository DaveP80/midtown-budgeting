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

    const handleChange = (e: any) => {
        setDescription(e.target.value);
    }

    const handleSubtotalChange = (e: any) => {
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
        <div className="bg-slate-100 flex flex-col md:m-4 xs:m-1 rounded shadow-md border border-green-700">
            <div className="text-center mb-4">
                {descriptions && (
                    <div>
                        <div>Total Income across all descriptions: {TotalIncome}</div>
                        <h3>Income with description: {description}, Total Income: {foundMatches ? foundMatches.amount : 0}</h3>
                    </div>
                )}
            </div>
            {income_data.length > 0 && <div className="mx-auto">
                <fetcher.Form className="mb-4">
                    <select onChange={handleChange} className="border border-gray-300 rounded-md p-2">
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
                    <Form method="post" action={`/profile/${id}/enterincome`} className="mb-4">
                        <label htmlFor='description_row' className="block mb-2">Add some more income for: {description}</label>
                        <input type="hidden" name="description_row" readOnly value={description} />
                        <input
                            type="text"
                            name="income_incrementer"
                            pattern="-?[0-9]*"
                            onChange={handleSubtotalChange}
                            required
                            placeholder='1'
                            className="border border-gray-300 rounded-md p-2 mr-2"
                        />
                        <input type="hidden" name="subtotal" readOnly value={subtotal || 0} />
                        <button name="enter_income_btn" type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md">Enter: {subtotal}</button>
                    </Form>
                )
                }
            </div>}
            <div className="mx-auto">
            <div className="text-center">
            <h2 className="text-dark mb-2">Add new Income row?</h2>
            </div>
            <fetcher.Form method="post" action={`/profile/${id}/newincome`} className="mb-4">
                <label htmlFor="description" className="block mb-2">description:</label>
                <input name="description" type="text" className="border border-gray-300 rounded-md p-2 mb-2" placeholder="job"/>
                <label htmlFor="amount" className="block mb-2">starting amount:</label>
                <input name="amount" type="text" required pattern="[0-9]*" className="border border-gray-300 rounded-md p-2 mb-2" placeholder="0"/>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Enter new income line!</button>
            </fetcher.Form>
            </div>
        </div>
    )
}

export default IncomeData