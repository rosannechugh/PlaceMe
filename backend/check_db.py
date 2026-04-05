import sqlite3

conn = sqlite3.connect("database.db")

try:
    conn.execute("ALTER TABLE Drive ADD COLUMN package TEXT")
    conn.execute("ALTER TABLE Drive ADD COLUMN eligible_branch TEXT")
except:
    pass

# Set all NULL roles to student
conn.execute("""
UPDATE Student
SET role = 'student'
WHERE role IS NULL
""")

conn.commit()


conn.execute("ALTER TABLE Application ADD COLUMN status TEXT DEFAULT 'Applied'")

conn.commit()
print("Status column added to Application table")
# Print all users
conn.row_factory = sqlite3.Row
rows = conn.execute("SELECT * FROM Student").fetchall()

for row in rows:
    print(dict(row))

conn.close()