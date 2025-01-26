import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";

function SummaryData({ all_data, summary_data }: { all_data: any[], summary_data: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (summary_data) {
            setLoading(false);
        }
    }, [summary_data])

    let TotalIncome = 0;
    if (all_data?.length > 0) {
        for (let n of all_data) {
            if (n.category === "income") {
                TotalIncome += Number(n.amount);
            }
        }
    }
    let TotalExpense = 0;
    if (all_data?.length > 0) {
        for (let n of all_data) {
            if (n.category === "expenses") {
                TotalExpense -= Number(n.amount);
            }
        }
    }
    let BottomLine = TotalIncome + TotalExpense;

    return (
        <>
            {
                (!TotalIncome && !TotalExpense) ?
                    <div>No Summary Data, Need to start tracking income and expenses.</div>
                    : <div>
                        <Form method="post">
                            <button onClick={() => setLoading(true)} name="bottom_line" value={BottomLine} type="submit" className="flex items-center space-x-2">
                                Generate Summary
                                <FontAwesomeIcon icon={faStar} />
                            </button>
                        </Form>
                        Your Disposable Income is: {BottomLine}.
                    </div>
            }
            {
                loading ? <FontAwesomeIcon icon={faSpinner} spin /> :
                    <>
                        {summary_data ? (
                            <div>
                                <button onClick={() => setOpen(true)} className="text-blue-500">Open Your AI Summary</button>
                                {open && (
                                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                        <div className="bg-white p-8 rounded-lg">
                                            {summary_data}
                                            <button onClick={() => setOpen(false)} className="text-red-500">Close</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </>

            }
        </>
    )
}

export default SummaryData