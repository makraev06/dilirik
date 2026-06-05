require("dotenv").config();
const { Pool } = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, "fileName", "details", "score", "createdAt" FROM "Resume" ORDER BY "createdAt" DESC');
    console.log(`TOTAL RECORDS: ${res.rows.length}`);
    res.rows.forEach((r, idx) => {
      console.log(`[${idx + 1}] ID: ${r.id} | Name: ${r.fileName} | Score: ${r.score} | Details Null?: ${r.details === null} | Details: ${JSON.stringify(r.details)}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
