"""SQLite schema and connection helpers for the placement drive system."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "placement.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    try:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS Student (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                cgpa REAL NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10)
            );

            CREATE TABLE IF NOT EXISTS Company (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS Drive (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company_id INTEGER NOT NULL REFERENCES Company(id),
                title TEXT NOT NULL,
                min_cgpa REAL NOT NULL CHECK (min_cgpa >= 0 AND min_cgpa <= 10),
                drive_date TEXT,
                description TEXT,
                UNIQUE(company_id, title)
            );

            CREATE TABLE IF NOT EXISTS Application (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL REFERENCES Student(id),
                drive_id INTEGER NOT NULL REFERENCES Drive(id),
                applied_at TEXT NOT NULL DEFAULT (datetime('now')),
                UNIQUE(student_id, drive_id)
            );

            CREATE INDEX IF NOT EXISTS idx_application_drive ON Application(drive_id);
            """
        )
        conn.commit()
    finally:
        conn.close()
