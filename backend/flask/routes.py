from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from datetime import datetime

from database import db
from models import User, Student, Attendance

auth = Blueprint("auth", __name__)

bcrypt = Bcrypt()


# =========================
# Signup API
# =========================

@auth.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:

        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:

        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User Registered Successfully"
    }), 201


# =========================
# Login API
# =========================

@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "message": "Email and Password are required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if user is None:

        return jsonify({
            "message": "User not found"
        }), 404

    if not bcrypt.check_password_hash(
        user.password,
        password
    ):

        return jsonify({
            "message": "Invalid Password"
        }), 401

    return jsonify({

        "message": "Login Successful",

        "user": {

            "id": user.id,
            "name": user.name,
            "email": user.email

        }

    }), 200
    # =========================
# Add Student
# =========================

@auth.route("/students", methods=["POST"])
def add_student():

    data = request.get_json()

    if (
        not data.get("name")
        or not data.get("roll_no")
        or not data.get("department")
        or not data.get("semester")
    ):

        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_student = Student.query.filter_by(
        roll_no=data["roll_no"]
    ).first()

    if existing_student:

        return jsonify({
            "message": "Roll Number already exists"
        }), 400

    student = Student(

        name=data["name"],

        roll_no=data["roll_no"],

        department=data["department"],

        semester=data["semester"],

        attendance=0,

        present=False

    )

    db.session.add(student)

    db.session.commit()

    return jsonify({
        "message": "Student Added Successfully"
    }), 201


# =========================
# Get All Students
# =========================

@auth.route("/students", methods=["GET"])
def get_students():

    students = Student.query.all()

    result = []

    for student in students:

        result.append({

            "id": student.id,

            "name": student.name,

            "roll_no": student.roll_no,

            "department": student.department,

            "semester": student.semester,

            "attendance": student.attendance,

            "present": student.present

        })

    return jsonify(result), 200


# =========================
# Update Student
# =========================

@auth.route("/students/<int:id>", methods=["PUT"])
def update_student(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({
            "message": "Student not found"
        }), 404

    data = request.get_json()

    student.name = data.get(
        "name",
        student.name
    )

    student.roll_no = data.get(
        "roll_no",
        student.roll_no
    )

    student.department = data.get(
        "department",
        student.department
    )

    student.semester = data.get(
        "semester",
        student.semester
    )

    db.session.commit()

    return jsonify({
        "message": "Student Updated Successfully"
    }), 200


# =========================
# Delete Student
# =========================

@auth.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):

    student = Student.query.get(id)

    if student is None:

        return jsonify({
            "message": "Student not found"
        }), 404

    db.session.delete(student)

    db.session.commit()

    return jsonify({
        "message": "Student Deleted Successfully"
    }), 200
    # =========================
# Mark Attendance
# =========================

@auth.route("/attendance/<int:id>", methods=["PUT"])
def mark_attendance(id):

    student = Student.query.get(id)

    if student is None:
        return jsonify({
            "message": "Student not found"
        }), 404

    data = request.get_json()

    present = data.get("present", False)

    attendance_date = data.get("date")

    if attendance_date:
        attendance_date = datetime.strptime(
            attendance_date,
            "%Y-%m-%d"
        )
    else:
        attendance_date = datetime.utcnow()

    # Check if attendance already exists for the selected date
    existing = Attendance.query.filter_by(
        student_id=student.id
    ).filter(
        db.func.date(Attendance.date) == attendance_date.date()
    ).first()

    if existing:

        existing.present = present

    else:

        new_record = Attendance(
            student_id=student.id,
            present=present,
            date=attendance_date
        )

        db.session.add(new_record)

    # Update current status
    student.present = present

    # Recalculate total present count
    student.attendance = Attendance.query.filter_by(
        student_id=student.id,
        present=True
    ).count()

    db.session.commit()

    return jsonify({

        "message": "Attendance Saved Successfully",

        "student": {

            "id": student.id,
            "name": student.name,
            "roll_no": student.roll_no,
            "attendance": student.attendance,
            "present": student.present

        }

    }), 200


# =========================
# Attendance History
# =========================

@auth.route("/attendance", methods=["GET"])
def get_attendance():

    records = Attendance.query.order_by(
        Attendance.date.desc()
    ).all()

    result = []

    for record in records:

        result.append({

            "id": record.id,

            "student_id": record.student.id,

            "name": record.student.name,

            "roll_no": record.student.roll_no,

            "department": record.student.department,

            "semester": record.student.semester,

            "attendance": record.student.attendance,

            "present": record.present,

            "date": record.date.strftime("%Y-%m-%d")

        })

    return jsonify(result), 200