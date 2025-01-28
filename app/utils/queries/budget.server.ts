import { SQLError } from "../lib/customErrors.js";
import { db } from "../render.server.ts";

const makeBudgetTables = async (id: string | number) => {
    if (!id) {
        throw new SQLError("need a id passed in", "sql operation error");
    }
    try {
        const foundId = await db.any(`select id from users where id = $1`, id)
        await db.any(`
        create table personal_finance_${foundId[0].id} (
            id serial primary key,
            user_id int references users(id),
            category varchar(10) check (category in ('income', 'expenses')),
            description varchar(255),
            amount numeric,
            constraint unique_description_category_${foundId[0].id} unique (description, category)
        )
        `)
        await db.any(`update users set has_budget = true where id = $1`, id);
    } catch (e) {
        throw (e);
    };
}

const tableExists = async (args: number | string) => {
    try {
        const checkIdExists = await db.any(`select id from users where id = $1`, args);
        if (checkIdExists?.length === 0) {
            return { message: "invalid id", ok: false, data: null };
        }
        const exists = await db.any('select id, email from users where id = $1 and has_budget = true', args);
        return { message: "checked for budget tables", ok: exists.length > 0, data: exists }
    } catch (e) {
        throw (e);
    }
}

const yourBudgetData = async (id: number | string) => {
    try {
        const personalFinanceData = await db.any(`select * from personal_finance_${id} order by category, description`);
        return { budget: personalFinanceData, ok: true };
    } catch (e) {
        throw (e);
    }
}

const enterNewIncomeDesc = async (args: any[]) => {
    try {
        await db.any(`insert into personal_finance_${args[0]} (user_id, category, description, amount) values ($1, $2, $3, $4)`, args);
        return { message: "new descriptor of income added", ok: true };

    } catch (e) {
        throw (e);

    };
}

const enterNewExpenseDesc = async (args: any[]) => {
    try {
        await db.any(`insert into personal_finance_${args[0]} (user_id, category, description, amount) values ($1, $2, $3, $4)`, args);
        return { message: "new descriptor of expense added", ok: true };

    } catch (e) {
        throw (e);

    };
}

const deleteFromExpenses = async (args: any[]) => {
    try {
        await db.any(`delete from personal_finance_${args[0]} where category = 'expenses' and description = '${args[1]}'`, args);
        return { message: "expenses deleted", ok: true };
    } catch (e) {
        throw (e);
    };
}

const deleteFromIncome = async (args: any[]) => {
    try {
        await db.any(`delete from personal_finance_${args[0]} where category = 'income' and description = '${args[1]}'`, args);
        return { message: "income deleted", ok: true };
    } catch (e) {
        throw (e);
    };
}

const updateIncomeOnDesc = async (args: any[]) => {
    try {
        await db.any(`update personal_finance_${args[0]} set amount = $4 where category = $2 and description = $3`, args);
        return { message: "income on description updated value", ok: true };
    } catch (e) {
        throw (e);
    };
}

const updateExpenseOnDesc = async (args: any[]) => {
    try {
        await db.any(`update personal_finance_${args[0]} set amount = $4 where category = $2 and description = $3`, args);
        return { message: "expense on description updated value", ok: true };
    } catch (e) {
        throw (e);
    };
}

export {
    tableExists,
    makeBudgetTables,
    yourBudgetData,
    enterNewIncomeDesc,
    enterNewExpenseDesc,
    updateIncomeOnDesc,
    updateExpenseOnDesc,
    deleteFromExpenses,
    deleteFromIncome
}