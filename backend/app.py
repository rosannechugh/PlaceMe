from flask import Flask, request, jsonify, session
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret123"

CORS(app, supports_credentials=True)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True
)
@app.route("/")
def home():
    return "Backend is running"
# ---------------- DATABASE ----------------
def get_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


# ---------------- INIT DB ----------------
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # STUDENT
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Student (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        cgpa REAL,
        branch TEXT,
        role TEXT DEFAULT 'student'
    )
    """)

    # COMPANY
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Company (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
    )
    """)

    # DRIVE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Drive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER,
        title TEXT,
        package TEXT,
        min_cgpa REAL,
        eligible_branch TEXT,
        drive_date TEXT,
        FOREIGN KEY(company_id) REFERENCES Company(id)
    )
    """)

    # APPLICATION
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS Application (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        drive_id INTEGER,
        status TEXT DEFAULT 'Applied',
        UNIQUE(student_id, drive_id),
        FOREIGN KEY(student_id) REFERENCES Student(id),
        FOREIGN KEY(drive_id) REFERENCES Drive(id)
    )
    """)

    conn.commit()
    conn.close()


# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = get_connection()

    try:
        conn.execute("""
            INSERT INTO Student (name, email, password, cgpa, branch)
            VALUES (?, ?, ?, ?, ?)
        """, (
            data["name"],
            data["email"],
            data["password"],
            data["cgpa"],
            data["branch"]
        ))

        conn.commit()
        return {"message": "Registered successfully"}

    except:
        return {"error": "User already exists"}

    finally:
        conn.close()


# ---------------- LOGIN ----------------
# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    # 🔥 Prevent crash if no JSON
    if not data:
        return {"error": "No data received"}, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Missing fields"}, 400

    conn = get_connection()

    user = conn.execute("""
        SELECT * FROM Student WHERE email=? AND password=?
    """, (email, password)).fetchone()

    conn.close()

    if user:
        session["student_id"] = user["id"]

        return {
            "message": "Login successful",
            "user": dict(user)
        }

    return {"error": "Invalid credentials"}, 401


# ---------------- LOGOUT ----------------
@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return {"message": "Logged out"}


# ---------------- GET DRIVES ----------------
@app.route("/drives")
def get_drives():
    conn = get_connection()

    data = conn.execute("""
        SELECT 
            d.id,
            d.title,
            d.package,
            d.min_cgpa,
            d.eligible_branch,
            d.drive_date,
            c.name AS company_name
        FROM Drive d
        JOIN Company c ON d.company_id = c.id
    """).fetchall()

    conn.close()

    return [dict(x) for x in data]


# ---------------- APPLY ----------------
@app.route("/apply", methods=["POST"])
def apply():
    student_id = session.get("student_id")

    if not student_id:
        return {"error": "Login required"}

    data = request.json
    drive_id = data.get("drive_id")

    conn = get_connection()

    try:
        student = conn.execute("""
            SELECT cgpa, branch FROM Student WHERE id=?
        """, (student_id,)).fetchone()

        drive = conn.execute("""
            SELECT min_cgpa, eligible_branch FROM Drive WHERE id=?
        """, (drive_id,)).fetchone()

        if not student or not drive:
            return {"error": "Invalid data"}

        # CGPA check
        if student["cgpa"] < drive["min_cgpa"]:
            return {"error": "Not eligible (CGPA)"}

        # Branch check
        if drive["eligible_branch"] != "All":
            allowed = drive["eligible_branch"].split(",")
            if student["branch"] not in allowed:
                return {"error": "Not eligible (Branch)"}

        # Duplicate check
        existing = conn.execute("""
            SELECT * FROM Application 
            WHERE student_id=? AND drive_id=?
        """, (student_id, drive_id)).fetchone()

        if existing:
            return {"error": "Already applied"}

        conn.execute("""
            INSERT INTO Application (student_id, drive_id, status)
            VALUES (?, ?, ?)
        """, (student_id, drive_id, "Applied"))

        conn.commit()

        return {"message": "Applied successfully"}

    except Exception as e:
        return {"error": str(e)}

    finally:
        conn.close()


# ---------------- COMPANIES ----------------
@app.route("/companies")
def get_companies():
    conn = get_connection()
    data = conn.execute("SELECT * FROM Company").fetchall()
    conn.close()
    return [dict(x) for x in data]


# ---------------- CREATE DRIVE ----------------
@app.route("/create-drive", methods=["POST"])
def create_drive():
    data = request.json

    conn = get_connection()

    conn.execute("""
        INSERT INTO Drive (company_id, title, package, min_cgpa, eligible_branch, drive_date)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["company_id"],
        data["title"],
        data["package"],
        data["min_cgpa"],
        data["eligible_branch"],
        data["drive_date"]
    ))

    conn.commit()
    conn.close()

    return {"message": "Drive created successfully"}


# ---------------- VIEW ALL APPLICATIONS ----------------
@app.route("/all-applications")
def all_applications():
    conn = get_connection()

    data = conn.execute("""
        SELECT 
            a.id,
            s.name AS student_name,
            s.email,
            c.name AS company_name,
            d.title,
            a.status
        FROM Application a
        JOIN Student s ON a.student_id = s.id
        JOIN Drive d ON a.drive_id = d.id
        JOIN Company c ON d.company_id = c.id
    """).fetchall()

    conn.close()

    return [dict(x) for x in data]


# ---------------- UPDATE STATUS ----------------
@app.route("/update-status", methods=["POST"])
def update_status():
    data = request.json

    conn = get_connection()

    conn.execute("""
        UPDATE Application SET status=? WHERE id=?
    """, (data["status"], data["id"]))

    conn.commit()
    conn.close()

    return {"message": "Status updated"}


# ---------------- ADD COMPANY ----------------
@app.route("/add-company", methods=["POST"])
def add_company():
    data = request.json

    conn = get_connection()

    try:
        conn.execute("INSERT INTO Company (name) VALUES (?)", (data["name"],))
        conn.commit()
    except:
        return {"error": "Company exists"}

    conn.close()

    return {"message": "Company added"}


# ---------------- CREATE ADMIN ----------------
def create_admin():
    conn = get_connection()

    existing = conn.execute("""
        SELECT * FROM Student WHERE email=?
    """, ("admin@college.edu",)).fetchone()

    if not existing:
        conn.execute("""
            INSERT INTO Student (name, email, password, cgpa, branch, role)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("Admin", "admin@college.edu", "admin123", 0, "Admin", "admin"))

        conn.commit()

    conn.close()


# ---------------- STUDENT APPLICATIONS ----------------
@app.route("/applications")
def get_applications():
    student_id = session.get("student_id")

    if not student_id:
        return {"error": "Login required"}

    conn = get_connection()

    data = conn.execute("""
        SELECT 
            a.id,
            d.title,
            c.name AS company_name,
            a.status
        FROM Application a
        JOIN Drive d ON a.drive_id = d.id
        JOIN Company c ON d.company_id = c.id
        WHERE a.student_id=?
    """, (student_id,)).fetchall()

    conn.close()

    return [dict(x) for x in data]


# ---------------- RUN ----------------
if __name__ == "__main__":
    init_db()
    create_admin()
    app.run()