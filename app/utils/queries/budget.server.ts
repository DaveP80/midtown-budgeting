import { SQLError } from "../lib/customErrors.js";
import { db } from "../render.server.ts";

const makeBudgetTables = async (id: string | number) => {
    if (!id) {
        throw new SQLError("need a id passed in", "sql operation error");
    }
    try {
        await db.any(`
        create table personal_finance_${id} (
            id serial primary key,
            user_id int references users(id),
            category varchar(10) check (category in ('income', 'expenses')),
            description varchar(255),
            amount numeric,
            constraint unique_description_category unique (description, category)
        )
        `)
        await db.any(`update users set has_budget = true where id = $1`, id);
    } catch (e) {
        throw (e);
    };
}

const tableExists = async (args: number | string) => {
    const exists = await db.any('select * from users where id = $1 and has_budget = true', args);
    return { message: "checked for budget tables", ok: exists.length || false }
}

const yourBudgetData = async (id: number | string) => {
    try {
        const personalFinanceData = await db.any(`select * from personal_finance_${id}`);
        return { budget: personalFinanceData, ok: true };
    } catch (e) {
        throw (e);
    }
}

export {
    tableExists,
    makeBudgetTables,
    yourBudgetData
}