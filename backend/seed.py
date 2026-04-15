import sys
import os
from datetime import datetime, timedelta

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.enrollment import Enrollment
from app.models.assignment import Assignment
from app.models.submission import Submission
from app.utils.auth import hash_password

# Initialize database
Base.metadata.create_all(bind=engine)
db: Session = SessionLocal()

def seed_roles():
    roles = [
        {"role_name": "Admin", "description": "Platform administrator"},
        {"role_name": "Instructor", "description": "Course creator"},
        {"role_name": "Student", "description": "Learner"}
    ]
    for r in roles:
        existing = db.query(Role).filter(Role.role_name == r["role_name"]).first()
        if not existing:
            db.add(Role(**r))
    db.commit()
    print("  [OK] Roles verified")

def seed_categories():
    categories = [
        {"category_name": "Development", "description": "Web, Mobile, and Software Development"},
        {"category_name": "Data Science", "description": "AI, ML, and Data Analytics"},
        {"category_name": "Design", "description": "UI/UX, Graphic Design, and Motion"},
        {"category_name": "Business", "description": "Marketing, Finance, and Management"},
        {"category_name": "Cybersecurity", "description": "Network Security and Ethical Hacking"}
    ]
    for c in categories:
        if not db.query(Category).filter(Category.category_name == c["category_name"]).first():
            db.add(Category(**c))
    db.commit()
    print("  [OK] Categories verified")

def seed_users():
    admin_role = db.query(Role).filter(Role.role_name == "Admin").first()
    instr_role = db.query(Role).filter(Role.role_name == "Instructor").first()
    stud_role = db.query(Role).filter(Role.role_name == "Student").first()

    # Admin
    if not db.query(User).filter(User.email == "admin@skillbridge.info").first():
        admin = User(
            name="SkillBridge Admin",
            email="admin@skillbridge.info",
            password=hash_password("arav1234"),
            role_id=admin_role.role_id
        )
        db.add(admin)

    # Instructor 1
    if not db.query(User).filter(User.email == "prof_sharma@skillbridge.info").first():
        instructor = User(
            name="Prof. Sharma",
            email="prof_sharma@skillbridge.info",
            password=hash_password("arav1234"),
            role_id=instr_role.role_id
        )
        db.add(instructor)
        db.flush()
        if not db.query(Instructor).filter(Instructor.email == instructor.email).first():
            db.add(Instructor(
                instructor_name=instructor.name,
                email=instructor.email,
                qualification="PhD in Computer Science",
                experience=12
            ))

    # Student 1
    if not db.query(User).filter(User.email == "stud_rahul@skillbridge.info").first():
        student = User(
            name="Rahul Ghiya",
            email="stud_rahul@skillbridge.info",
            password=hash_password("arav1234"),
            role_id=stud_role.role_id
        )
        db.add(student)

    db.commit()
    print("  [OK] Core Users verified")

def seed_courses():
    instructor = db.query(Instructor).first()
    category = db.query(Category).first()
    
    if not instructor or not category:
        print("  [WARN] Skipping courses - instructor/category missing")
        return

    courses = [
        {
            "course_title": "Full-Stack Web Development Mastery (2026)",
            "description": "Master React, FastAPI, and PostgreSQL with a premium project-based approach.",
            "duration": 45,
            "category_id": category.category_id,
            "instructor_id": instructor.instructor_id,
            "level": "Advanced"
        },
        {
            "course_title": "UI/UX Design Systems with Figma",
            "description": "Create scalable design systems and high-fidelity prototypes.",
            "duration": 30,
            "category_id": category.category_id,
            "instructor_id": instructor.instructor_id,
            "level": "Intermediate"
        },
        {
            "course_title": "Python for Data Science Bootcamp",
            "description": "From zero to AI. Learn Pandas, Scikit-learn, and more.",
            "duration": 50,
            "category_id": category.category_id,
            "instructor_id": instructor.instructor_id,
            "level": "Beginner"
        }
    ]

    for c in courses:
        if not db.query(Course).filter(Course.course_title == c["course_title"]).first():
            db.add(Course(**c))
    
    db.commit()
    print("  [OK] Courses verified")

def seed_assignments():
    course = db.query(Course).first()
    if not course: return
    
    assignments = [
        {"title": "React Dashboard Implementation", "description": "Build a responsive dashboard using Tailwind.", "course_id": course.course_id},
        {"title": "Database Schema Design", "description": "Design an ER diagram for a school management system.", "course_id": course.course_id}
    ]
    for a in assignments:
        if not db.query(Assignment).filter(Assignment.title == a["title"], Assignment.course_id == a["course_id"]).first():
            db.add(Assignment(
                due_date=datetime.now() + timedelta(days=7),
                **a
            ))
    db.commit()
    print("  [OK] Assignments verified")

def seed_others():
    student = db.query(User).filter(User.email == "stud_rahul@skillbridge.info").first()
    course = db.query(Course).first()
    assignment = db.query(Assignment).first()
    
    if not (student and course and assignment): return

    # Enrollment
    if not db.query(Enrollment).filter(Enrollment.user_id == student.user_id, Enrollment.course_id == course.course_id).first():
        db.add(Enrollment(user_id=student.user_id, course_id=course.course_id, progress=65))
    
    # Submission
    if not db.query(Submission).filter(Submission.user_id == student.user_id, Submission.assignment_id == assignment.assignment_id).first():
        db.add(Submission(
            user_id=student.user_id,
            assignment_id=assignment.assignment_id,
            marks=85,
            submission_date=datetime.now() - timedelta(days=1)
        ))
    
    db.commit()
    print("  [OK] Progress & Grades data enriched")

if __name__ == "__main__":
    print("\n[SkillBridge Database Seeder - 2026 Edition]")
    print("=" * 45)
    try:
        seed_roles()
        seed_categories()
        seed_users()
        seed_courses()
        seed_assignments()
        seed_others()
        print("=" * 45)
        print("[OK] ALL SEEDING TASKS FINISHED! Website is ready.\n")
    except Exception as e:
        db.rollback()
        print(f"\n[FATAL ERROR]: {e}")
    finally:
        db.close()
