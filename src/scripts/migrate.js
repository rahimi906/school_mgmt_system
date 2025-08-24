require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { db } = require("../config/db");

async function migrate() {
  try {
    const sqlPath = path.join(__dirname, "../../seed_db/tables.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await db.query(sql);
    console.log("Tables created successfully.");
  } catch (err) {
    console.error(" Migration failed:", err);
  } finally {
    await db.end();
  }
}

migrate();
