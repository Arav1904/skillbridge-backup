"""
SkillBridge Database Seeder
MUST run from inside the backend folder:

    cd skillbridge/backend
    py seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone, timedelta
from app.database import SessionLocal, engine, Base
from app.utils.auth import hash_password

# Import ALL models so SQLAlchemy registers them before create_all
from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from app.models.instructor import Instructor
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.assignment import Assignment
from app.models.enrollment import Enrollment
from app.models.submission import Submission
from app.models.certificate import Certificate

Base.metadata.create_all(bind=engine)
db = SessionLocal()
now = datetime.now(timezone.utc)

def seed():
    print("\n🌱  SkillBridge Database Seeder")
    print("=" * 40)

    if not db.query(Role).first():
        db.add_all([
            Role(role_id=1, role_name="Admin",      description="Platform administrator"),
            Role(role_id=2, role_name="Instructor",  description="Course creator & teacher"),
            Role(role_id=3, role_name="Student",     description="Enrolled learner"),
        ]); db.commit(); print("  ✅ Roles")
    else: print("  ⏭  Roles")

    if not db.query(User).first():
        db.add_all([
            User(user_id=1, name="Admin User",          email="admin@skillbridge.com", password=hash_password("admin123"),  role_id=1),
            User(user_id=2, name="Prof. Ananya Sharma", email="prof@test.com",          password=hash_password("test123"),   role_id=2),
            User(user_id=3, name="Dr. Vikram Mehta",    email="vikram@test.com",         password=hash_password("test123"),   role_id=2),
            User(user_id=4, name="Rahul Student",       email="student@test.com",        password=hash_password("test123"),   role_id=3),
            User(user_id=5, name="Priya Learner",       email="priya@test.com",          password=hash_password("test123"),   role_id=3),
        ]); db.commit(); print("  ✅ Users (1 admin, 2 instructors, 2 students)")
    else: print("  ⏭  Users")

    if not db.query(Category).first():
        db.add_all([
            Category(category_id=1, category_name="Programming",     description="Software dev & coding"),
            Category(category_id=2, category_name="Data Science",    description="Data analysis, ML & AI"),
            Category(category_id=3, category_name="Web Development", description="Frontend & backend web"),
            Category(category_id=4, category_name="Database",        description="SQL, NoSQL & design"),
            Category(category_id=5, category_name="Cloud Computing", description="AWS, Azure, GCP, DevOps"),
        ]); db.commit(); print("  ✅ Categories")
    else: print("  ⏭  Categories")

    if not db.query(Instructor).first():
        db.add_all([
            Instructor(instructor_id=1, instructor_name="Prof. Ananya Sharma", email="ananya@skillbridge.com", qualification="PhD Computer Science", experience=12),
            Instructor(instructor_id=2, instructor_name="Dr. Vikram Mehta",    email="vikram@skillbridge.com", qualification="MTech Software Eng",   experience=8),
            Instructor(instructor_id=3, instructor_name="Ms. Priya Nair",      email="priya@skillbridge.com",  qualification="MBA Data Analytics",   experience=5),
        ]); db.commit(); print("  ✅ Instructors")
    else: print("  ⏭  Instructors")

    if not db.query(Course).first():
        db.add_all([
            Course(course_id=1, course_title="Python for Beginners",        description="Learn Python from scratch — variables, loops, OOP and file handling.", duration=30, level="Beginner",     category_id=1, instructor_id=1),
            Course(course_id=2, course_title="Data Science with Pandas",    description="Master data analysis using Pandas, NumPy and Matplotlib.",             duration=40, level="Intermediate", category_id=2, instructor_id=1),
            Course(course_id=3, course_title="Full Stack Web Development",  description="Build complete web apps with React + FastAPI. Deploy to cloud.",       duration=60, level="Advanced",     category_id=3, instructor_id=2),
            Course(course_id=4, course_title="PostgreSQL Mastery",          description="Deep dive into relational databases — queries, indexes, transactions.", duration=25, level="Intermediate", category_id=4, instructor_id=2),
            Course(course_id=5, course_title="Cloud & DevOps Fundamentals", description="AWS, Docker, CI/CD pipelines and Terraform basics.",                    duration=45, level="Beginner",     category_id=5, instructor_id=3),
        ]); db.commit(); print("  ✅ Courses")
    else: print("  ⏭  Courses")

    if not db.query(Lesson).first():
        db.add_all([
            Lesson(lesson_id=1,  course_id=1, lesson_title="Introduction to Python",   lesson_content="History, installation, first program, REPL basics.",       lesson_duration=20),
            Lesson(lesson_id=2,  course_id=1, lesson_title="Variables & Data Types",   lesson_content="int, float, str, list, tuple, dict, set with examples.",   lesson_duration=25),
            Lesson(lesson_id=3,  course_id=1, lesson_title="Control Flow & Loops",     lesson_content="if-else, for, while, break, continue, range().",           lesson_duration=30),
            Lesson(lesson_id=4,  course_id=2, lesson_title="Pandas DataFrames",        lesson_content="Creating, indexing, filtering and aggregating DataFrames.", lesson_duration=40),
            Lesson(lesson_id=5,  course_id=2, lesson_title="Data Visualization",       lesson_content="Matplotlib & Seaborn charts for exploratory analysis.",     lesson_duration=35),
            Lesson(lesson_id=6,  course_id=3, lesson_title="React Components & Props", lesson_content="Functional components, JSX, props, state with useState.",  lesson_duration=45),
            Lesson(lesson_id=7,  course_id=3, lesson_title="FastAPI Backend Basics",   lesson_content="Routes, models, responses, dependency injection.",         lesson_duration=50),
            Lesson(lesson_id=8,  course_id=4, lesson_title="Advanced SQL Queries",     lesson_content="JOINs, subqueries, CTEs, window functions.",               lesson_duration=35),
            Lesson(lesson_id=9,  course_id=5, lesson_title="AWS Core Services",        lesson_content="EC2, S3, RDS, Lambda and IAM basics.",                     lesson_duration=55),
            Lesson(lesson_id=10, course_id=5, lesson_title="Docker Fundamentals",      lesson_content="Images, containers, Dockerfile, docker-compose.",          lesson_duration=40),
        ]); db.commit(); print("  ✅ Lessons (10)")
    else: print("  ⏭  Lessons")

    if not db.query(Assignment).first():
        db.add_all([
            Assignment(assignment_id=1, course_id=1, title="Python Calculator",        description="Build a CLI calculator with +,-,*,/ and error handling.",               due_date=now+timedelta(days=7)),
            Assignment(assignment_id=2, course_id=1, title="File I/O Program",         description="Read a CSV, process it, and output a summary report.",                  due_date=now+timedelta(days=14)),
            Assignment(assignment_id=3, course_id=2, title="EDA on Real Dataset",      description="Exploratory data analysis on the Titanic dataset using Pandas.",         due_date=now+timedelta(days=10)),
            Assignment(assignment_id=4, course_id=3, title="React Todo App",           description="Full CRUD todo app with React, localStorage and Tailwind CSS.",          due_date=now+timedelta(days=12)),
            Assignment(assignment_id=5, course_id=4, title="Database Design Project",  description="Design ER diagram and implement normalized schema for e-commerce app.", due_date=now+timedelta(days=21)),
        ]); db.commit(); print("  ✅ Assignments")
    else: print("  ⏭  Assignments")

    if not db.query(Enrollment).first():
        db.add_all([
            Enrollment(user_id=4, course_id=1, progress=65),
            Enrollment(user_id=4, course_id=2, progress=30),
            Enrollment(user_id=5, course_id=1, progress=90),
            Enrollment(user_id=5, course_id=3, progress=20),
        ]); db.commit(); print("  ✅ Enrollments")
    else: print("  ⏭  Enrollments")

    if not db.query(Submission).first():
        db.add_all([
            Submission(assignment_id=1, user_id=4, marks=88),
            Submission(assignment_id=3, user_id=5, marks=92),
            Submission(assignment_id=2, user_id=4, marks=None),
        ]); db.commit(); print("  ✅ Submissions (2 graded, 1 pending)")
    else: print("  ⏭  Submissions")

    if not db.query(Certificate).first():
        db.add(Certificate(user_id=5, course_id=1, grade="A"))
        db.commit(); print("  ✅ Certificates")
    else: print("  ⏭  Certificates")

    print("=" * 40)
    print("✅  Done!\n")
    print("Login credentials:")
    print("  Student:    student@test.com  / test123")
    print("  Instructor: prof@test.com     / test123")
    print("  Admin:      admin@skillbridge.com / admin123\n")

if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        db.rollback(); print(f"\n❌ Error: {e}"); raise
    finally:
        db.close()
