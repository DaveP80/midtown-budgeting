function SummaryData({all_data}: {all_data: any[]}) {
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
            Your Bottom Line is: {BottomLine}.
            {
                BottomLine <= 1 ? <p>Work on cutting expenses, expenses are too high now.</p> :
                <p>Your Bottom Line is greater than zero, would you like to improve that?</p>
            }
        </div>
    }
    </>
  )
}

export default SummaryData