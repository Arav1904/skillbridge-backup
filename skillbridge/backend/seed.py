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

from sqlalchemy import text

# Wipe existing schema dynamically to ensure clean seed
with engine.connect() as conn:
    conn.execute(text('DROP SCHEMA public CASCADE; CREATE SCHEMA public;'))
    conn.commit()

Base.metadata.create_all(bind=engine)
db = SessionLocal()
now = datetime.now(timezone.utc)

def seed():
    print("\n🌱  SkillBridge Database Seeder")
    print("=" * 40)

    # 1. 10 Roles
    if not db.query(Role).first():
        db.add_all([
            Role(role_id=1, role_name="Admin", description="Platform administrator"),
            Role(role_id=2, role_name="Instructor", description="Course creator & teacher"),
            Role(role_id=3, role_name="Student", description="Enrolled learner"),
            Role(role_id=4, role_name="Teaching Assistant", description="Assists instructors with grading"),
            Role(role_id=5, role_name="Moderator", description="Forum and community manager"),
            Role(role_id=6, role_name="Support", description="Customer support representative"),
            Role(role_id=7, role_name="Content Creator", description="Creates auxiliary course content"),
            Role(role_id=8, role_name="Reviewer", description="Reviews submissions and content"),
            Role(role_id=9, role_name="Manager", description="General platform manager"),
            Role(role_id=10, role_name="Guest", description="Temporary read-only access user"),
        ])
        db.commit()
        print("  ✅ Roles (10 rows)")

    # 2. 10 Users
    if not db.query(User).first():
        db.add_all([
            User(user_id=1, name="Admin User", email="admin@test.com", password=hash_password("test123"), role_id=1),
            User(user_id=2, name="Prof. Ananya", email="ananya@test.com", password=hash_password("test123"), role_id=2),
            User(user_id=3, name="Dr. Vikram", email="vikram@test.com", password=hash_password("test123"), role_id=2),
            User(user_id=4, name="Ms. Priya", email="priya@test.com", password=hash_password("test123"), role_id=2),
            User(user_id=5, name="Rahul Student", email="rahul@test.com", password=hash_password("test123"), role_id=3),
            User(user_id=6, name="Sneha Learner", email="sneha@test.com", password=hash_password("test123"), role_id=3),
            User(user_id=7, name="Arjun Gupta", email="arjun@test.com", password=hash_password("test123"), role_id=3),
            User(user_id=8, name="Kavya Singh", email="kavya@test.com", password=hash_password("test123"), role_id=3),
            User(user_id=9, name="Rohan Sharma", email="rohan@test.com", password=hash_password("test123"), role_id=3),
            User(user_id=10, name="Aditi Rao", email="aditi@test.com", password=hash_password("test123"), role_id=3),
        ])
        db.commit()
        print("  ✅ Users (10 rows)")

    # 3. 10 Categories
    if not db.query(Category).first():
        db.add_all([
            Category(category_id=1, category_name="Programming", description="Software dev & coding"),
            Category(category_id=2, category_name="Data Science", description="Data analysis, ML & AI"),
            Category(category_id=3, category_name="Web Development", description="Frontend & backend web"),
            Category(category_id=4, category_name="Database", description="SQL, NoSQL & design"),
            Category(category_id=5, category_name="Cloud Computing", description="AWS, Azure, GCP, DevOps"),
            Category(category_id=6, category_name="Mobile App Dev", description="iOS, Android & Flutter"),
            Category(category_id=7, category_name="UI/UX Design", description="Figma, Wireframing & Design"),
            Category(category_id=8, category_name="Cybersecurity", description="Ethical Hacking & Network Security"),
            Category(category_id=9, category_name="Game Development", description="Unity, Unreal Engine & C#"),
            Category(category_id=10, category_name="DevOps", description="Docker, Kubernetes & CI/CD Pipelines"),
        ])
        db.commit()
        print("  ✅ Categories (10 rows)")

    # 4. 10 Instructors
    if not db.query(Instructor).first():
        db.add_all([
            Instructor(instructor_id=1, instructor_name="Prof. Ananya", email="ananya@test.com", qualification="PhD Computer Science", experience=12),
            Instructor(instructor_id=2, instructor_name="Dr. Vikram", email="vikram@test.com", qualification="MTech Software Eng", experience=8),
            Instructor(instructor_id=3, instructor_name="Ms. Priya", email="priya@test.com", qualification="MBA Data Analytics", experience=5),
            Instructor(instructor_id=4, instructor_name="Mr. Sanjay", email="sanjay@test.com", qualification="BTech IT", experience=10),
            Instructor(instructor_id=5, instructor_name="Ms. Neha", email="neha@test.com", qualification="MSc Computer Applications", experience=7),
            Instructor(instructor_id=6, instructor_name="Dr. Raj", email="raj@test.com", qualification="PhD Mobile Computing", experience=15),
            Instructor(instructor_id=7, instructor_name="Ms. Pooja", email="pooja@test.com", qualification="Masters in Design", experience=6),
            Instructor(instructor_id=8, instructor_name="Mr. Amit", email="amit@test.com", qualification="BCA Cybersecurity", experience=4),
            Instructor(instructor_id=9, instructor_name="Dr. Suresh", email="suresh@test.com", qualification="PhD Machine Learning", experience=20),
            Instructor(instructor_id=10, instructor_name="Ms. Kavita", email="kavita@test.com", qualification="MTech DevOps", experience=9),
        ])
        db.commit()
        print("  ✅ Instructors (10 rows)")

    # 5. 10 Courses
    if not db.query(Course).first():
        db.add_all([
            Course(course_id=1, course_title="Python for Beginners", description="Learn Python from scratch", duration=30, level="Beginner", category_id=1, instructor_id=1),
            Course(course_id=2, course_title="Data Science with Pandas", description="Master data analysis", duration=40, level="Intermediate", category_id=2, instructor_id=2),
            Course(course_id=3, course_title="React Mastery", description="Build complete web apps", duration=60, level="Advanced", category_id=3, instructor_id=3),
            Course(course_id=4, course_title="PostgreSQL Mastery", description="Deep dive into relational DBs", duration=25, level="Intermediate", category_id=4, instructor_id=4),
            Course(course_id=5, course_title="Cloud & DevOps Basics", description="AWS, Docker, CI/CD", duration=45, level="Beginner", category_id=5, instructor_id=5),
            Course(course_id=6, course_title="Advanced Flutter App Dev", description="Cross platform modern apps", duration=50, level="Intermediate", category_id=6, instructor_id=6),
            Course(course_id=7, course_title="Figma Pro UI Design", description="Designing beautiful interfaces", duration=20, level="Beginner", category_id=7, instructor_id=7),
            Course(course_id=8, course_title="Ethical Hacking 101", description="Network pentesting basics", duration=55, level="Advanced", category_id=8, instructor_id=8),
            Course(course_id=9, course_title="Unity 3D Game Building", description="C# game development", duration=70, level="Intermediate", category_id=9, instructor_id=9),
            Course(course_id=10, course_title="Docker & Kubernetes", description="Modern microservices DevOps", duration=35, level="Advanced", category_id=10, instructor_id=10),
        ])
        db.commit()
        print("  ✅ Courses (10 rows)")

    # 6. 10 Lessons
    if not db.query(Lesson).first():
        db.add_all([
            Lesson(lesson_id=1, course_id=1, lesson_title="Introduction to Python", lesson_content="Installation, REPL basics.", lesson_duration=20),
            Lesson(lesson_id=2, course_id=2, lesson_title="Pandas DataFrames", lesson_content="Creating, filtering DataFrames.", lesson_duration=25),
            Lesson(lesson_id=3, course_id=3, lesson_title="React Components & Props", lesson_content="Functional components, JSX.", lesson_duration=30),
            Lesson(lesson_id=4, course_id=4, lesson_title="Advanced SQL Queries", lesson_content="JOINs, subqueries, CTEs.", lesson_duration=15),
            Lesson(lesson_id=5, course_id=5, lesson_title="AWS Core Services", lesson_content="EC2, S3, RDS, Lambda basics.", lesson_duration=40),
            Lesson(lesson_id=6, course_id=6, lesson_title="Flutter Widget Tree", lesson_content="Stateless vs Stateful widgets.", lesson_duration=35),
            Lesson(lesson_id=7, course_id=7, lesson_title="Figma Layout Grids", lesson_content="Setting up perfect responsive grids.", lesson_duration=45),
            Lesson(lesson_id=8, course_id=8, lesson_title="Nmap Port Scanning", lesson_content="Finding vulnerabilities.", lesson_duration=50),
            Lesson(lesson_id=9, course_id=9, lesson_title="Unity Physics Engine", lesson_content="Rigidbodies and colliders.", lesson_duration=60),
            Lesson(lesson_id=10, course_id=10, lesson_title="Kubernetes Pods", lesson_content="Deploying containers efficiently.", lesson_duration=20),
        ])
        db.commit()
        print("  ✅ Lessons (10 rows)")

    # 7. 10 Assignments
    if not db.query(Assignment).first():
        db.add_all([
            Assignment(assignment_id=1, course_id=1, title="Build a Calculator", description="Build a CLI calculator.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=2, course_id=2, title="Titanic EDA", description="Analyze Titanic survivor dataset.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=3, course_id=3, title="React Todo App", description="Full CRUD app in React.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=4, course_id=4, title="ER Diagram Design", description="Design schema for e-commerce.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=5, course_id=5, title="Deploy EC2 App", description="Deploy simple page to AWS.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=6, course_id=6, title="Flutter UI Challenge", description="Clone WhatsApp frontend.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=7, course_id=7, title="Wireframe Mockup", description="Wireframe a bakery website.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=8, course_id=8, title="Vulnerability Report", description="Scan test server for flaws.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=9, course_id=9, title="Ping Pong Game", description="Create 2D ping pong clone.", due_date=now+timedelta(days=7)),
            Assignment(assignment_id=10, course_id=10, title="K8s Deployment File", description="Write a deployment YAML.", due_date=now+timedelta(days=7)),
        ])
        db.commit()
        print("  ✅ Assignments (10 rows)")

    # 8. 10 Enrollments
    if not db.query(Enrollment).first():
        db.add_all([
            Enrollment(user_id=5, course_id=1, progress=10),
            Enrollment(user_id=6, course_id=2, progress=20),
            Enrollment(user_id=7, course_id=3, progress=30),
            Enrollment(user_id=8, course_id=4, progress=40),
            Enrollment(user_id=9, course_id=5, progress=50),
            Enrollment(user_id=10, course_id=6, progress=60),
            Enrollment(user_id=5, course_id=7, progress=70),
            Enrollment(user_id=6, course_id=8, progress=80),
            Enrollment(user_id=7, course_id=9, progress=90),
            Enrollment(user_id=8, course_id=10, progress=100),
        ])
        db.commit()
        print("  ✅ Enrollments (10 rows)")

    # 9. 10 Submissions
    if not db.query(Submission).first():
        db.add_all([
            Submission(assignment_id=1, user_id=5, marks=80),
            Submission(assignment_id=2, user_id=6, marks=85),
            Submission(assignment_id=3, user_id=7, marks=90),
            Submission(assignment_id=4, user_id=8, marks=95),
            Submission(assignment_id=5, user_id=9, marks=100),
            Submission(assignment_id=6, user_id=10, marks=75),
            Submission(assignment_id=7, user_id=5, marks=70),
            Submission(assignment_id=8, user_id=6, marks=65),
            Submission(assignment_id=9, user_id=7, marks=60),
            Submission(assignment_id=10, user_id=8, marks=55),
        ])
        db.commit()
        print("  ✅ Submissions (10 rows)")

    # 10. 10 Certificates
    if not db.query(Certificate).first():
        db.add_all([
            Certificate(user_id=5, course_id=1, grade="A"),
            Certificate(user_id=6, course_id=2, grade="B"),
            Certificate(user_id=7, course_id=3, grade="A"),
            Certificate(user_id=8, course_id=4, grade="A+"),
            Certificate(user_id=9, course_id=5, grade="B+"),
            Certificate(user_id=10, course_id=6, grade="C"),
            Certificate(user_id=5, course_id=7, grade="A"),
            Certificate(user_id=6, course_id=8, grade="A"),
            Certificate(user_id=7, course_id=9, grade="B"),
            Certificate(user_id=8, course_id=10, grade="A+"),
        ])
        db.commit()
        print("  ✅ Certificates (10 rows)")

    # Reset all auto-increment sequences so new inserts start at 11+
    sequences = [
        ("users",        "user_id"),
        ("roles",        "role_id"),
        ("categories",   "category_id"),
        ("instructors",  "instructor_id"),
        ("courses",      "course_id"),
        ("lessons",      "lesson_id"),
        ("assignments",  "assignment_id"),
        ("submissions",  "submission_id"),
        ("certificates", "certificate_id"),
        ("enrollment",   "enrollment_id"),
    ]
    for table, col in sequences:
        try:
            db.execute(text(f"SELECT setval(pg_get_serial_sequence('{table}', '{col}'), (SELECT COALESCE(MAX({col}), 0) FROM {table}) + 1, false)"))
        except Exception:
            pass  # skip if table has no sequence (e.g. composite PK)
    db.commit()
    print("  ✅ Auto-increment sequences reset")

    print("=" * 40)
    print("✅  Done!\n")
    print("Login credentials:")
    print("  Student:    rahul@test.com  / test123")
    print("  Instructor: ananya@test.com / test123")
    print("  Admin:      admin@test.com  / test123\n")

if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error: {e}")
        raise
    finally:
        db.close()
