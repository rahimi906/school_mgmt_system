require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { db } = require("../config/db");

async function seed() {
  try {
    const sqlPath = path.join(__dirname, "../../seed_db/seed-seed-db.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await db.query(sql);
    console.log(" Seed data inserted successfully.");
  } catch (err) {
    console.error(" Seeding failed:", err);
  } finally {
    await db.end();
  }
}

seed();
