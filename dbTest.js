const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected:", res.rows[0]);
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
