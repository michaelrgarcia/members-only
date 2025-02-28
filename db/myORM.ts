import pool from "./pool.js";

interface WhereCondition {
  column: string;
  equals: any;
}

export async function rowSelect(table: string, condition?: WhereCondition) {
  // add support for "AND" conditions? WhereCondition[]

  if (condition) {
    const { column, equals } = condition;

    const { rows } = await pool.query(
      `SELECT * FROM ${table} WHERE ${column} = $1`,
      [equals]
    );

    return rows[0];
  } else {
    const { rows } = await pool.query(`SELECT * FROM ${table}`);

    return rows;
  }
}
