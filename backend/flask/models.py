from database import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    roll_no = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )

    department = db.Column(
        db.String(100),
        nullable=False
    )

    semester = db.Column(
        db.Integer,
        nullable=False
    )

    attendance = db.Column(
        db.Integer,
        default=0
    )

    present = db.Column(
        db.Boolean,
        default=False
    )

    def __repr__(self):
        return f"<Student {self.name}>"



# =========================
# Attendance History Model
# =========================

class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id"),
        nullable=False
    )

    date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    present = db.Column(
        db.Boolean,
        default=False
    )

    student = db.relationship(
        "Student",
        backref="attendance_records"
    )