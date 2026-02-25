const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { seed } = require("./seed");
const { runMigrations } = require("./migrate");

const DB_PATH = path.join(__dirname, "..", "tracker.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Run schema
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(schema);

// Seed data
seed(db);

// Run migrations
runMigrations(db);

module.exports = db;
