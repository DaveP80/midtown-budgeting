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

const enterNewIncomeDesc = async(args: any[]) => {
    try {
        await db.any(`insert into personal_finance_${args[0]} (user_id, category, description, amount) values ($1, $2, $3, $4)`, args);
        return {message: "new descriptor of income added", ok: true};

    } catch(e) {
        throw (e);

    };
}

const enterNewExpenseDesc = async(args: any[]) => {
    try {
        await db.any(`insert into personal_finance_${args[0]} (user_id, category, description, amount) values ($1, $2, $3, $4)`, args);
        return {message: "new descriptor of expense added", ok: true};

    } catch(e) {
        throw (e);

    };
}

const updateIncomeOnDesc = async(args: any[]) => {
    try {
        await db.any(`update personal_finance_${args[0]} set amount = $4 where category = $2 and description = $3`, args);
        return {message: "income on description updated value", ok: true};
    } catch(e) {
        throw (e);

    };
}

const updateExpenseOnDesc = async(args: any[]) => {
    try {
        await db.any(`update personal_finance_${args[0]} set amount = $4 where category = $2 and description = $3`, args);
        return {message: "expense on description updated value", ok: true};
    } catch(e) {
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
    updateExpenseOnDesc
}