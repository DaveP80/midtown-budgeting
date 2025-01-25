import pgPromise from "pg-promise";

const cn = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: true
};

const pgp = pgPromise();

const db = pgp(cn as {});

db.connect()
    .then((obj: any) => {
        console.log("Postgres connection established");
        obj.done();
    })
    .catch((e: any) => {
        console.log("ERROR:", e.message || e);
    });

export { db };
