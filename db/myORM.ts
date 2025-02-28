import pool from "./pool.js";

interface WhereCondition {
  column: string;
  equals: any;
}

interface Item {
  column: string;
  value: any;
}

export async function rowSelect(
  table: string,
  condition?: WhereCondition
): Promise<any> {
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

export async function tableInsert(table: string, items: Item[]) {
  const columns = items.map((item) => item.column).join(", ");
  const parameters = items
    .map((_, itemIndex) => "$" + `${itemIndex + 1}`)
    .join(", ");
  const values = items.map((item) => item.value);

  return await pool.query(
    `INSERT INTO ${table} (${columns}) VALUES (${parameters})`,
    values
  );
}

export async function updateColumns(
  table: string,
  items: Item[],
  rowId: number
) {
  const columnsWithParams = items
    .map((item, index) => `${item.column} = ` + "$" + `${index + 1}`)
    .join(", ");
  const values = items.map((item) => item.value);

  return await pool.query(
    `UPDATE ${table}  SET ${columnsWithParams} WHERE id = ` +
      "$" +
      `${items.length + 1}`,
    [...values, rowId]
  );
}

// one-off

export async function allMsgs() {
  const { rows } = await pool.query(
    "SELECT messages.id, messages.title, messages.content, users.first_name, users.last_name, messages.created FROM messages JOIN users ON (users.id=messages.author)"
  );

  return rows;
}

export async function deleteRowById(table: string, rowId: number) {
  return await pool.query(`DELETE FROM ${table} WHERE id = $1`, [rowId]);
}
