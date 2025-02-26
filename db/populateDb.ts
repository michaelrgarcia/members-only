import pg from "pg";

import { config } from "dotenv";

config();

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR ( 50 ),
  last_name VARCHAR ( 50 ),
  email VARCHAR ( 255 ),
  password TEXT,
  admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 90 ),
  content VARCHAR ( 500 ),
  author INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created TIMESTAMPTZ
);
`;

// this script should be ran ONCE with npx tsx populateDb.ts

async function populateDb() {
  console.log("seeding...");

  const client = new pg.Client({
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

populateDb();
