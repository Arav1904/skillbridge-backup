import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star, Clock } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.get('/courses/?limit=100'),
          api.get('/submissions/'),
        ]);
        setCourses(cRes.data);
        setSubmissions(sRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Loading instructor dashboard..." />;

  const ungraded = submissions.filter(s => s.marks == null).length;
  const graded = submissions.filter(s => s.marks != null).length;

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/instructor/courses' },
    { label: 'Submissions', value: submissions.length, icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/instructor/grading' },
    { label: 'Awaiting Grade', value: ungraded, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/instructor/grading' },
    { label: 'Graded', value: graded, icon: Star, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/instructor/grading' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="relative rounded-3xl p-7 overflow-hidden"
        style={{background:'linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(6,6,26,0.9) 100%)',border:'1px solid rgba(16,185,129,0.15)'}}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-64 h-64 bg-emerald-500 -top-16 -right-16 opacity-10" />
          <div className="orb w-48 h-48 bg-teal-600 bottom-0 left-0 opacity-10" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Instructor Portal</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">Welcome, {user?.name?.split(' ')[0]} 🎓</h1>
            <p className="text-[#9090b8] text-sm">
              {ungraded > 0 ? `You have ${ungraded} submission${ungraded > 1 ? 's' : ''} awaiting grades.` : 'All submissions are graded. Great work!'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/instructor/create-course" className="btn-emerald px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <PlusCircle size={15} /> New Course
            </Link>
            <Link to="/instructor/grading" className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <ClipboardCheck size={15} /> Grade Now
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className={`stat-card border ${bg} hover:scale-[1.03] transition-all duration-200`}>
            <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center mb-3`}><Icon size={18} className={color} /></div>
            <div className="text-2xl font-display font-bold text-white">{value}</div>
            <div className="text-xs text-[#9090b8] mt-1">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses preview */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">My Courses</h2>
            <Link to="/instructor/courses" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen size={36} className="text-[#9090b8] mx-auto mb-3 opacity-40" />
              <p className="text-sm text-[#9090b8] mb-4">No courses created yet</p>
              <Link to="/instructor/create-course" className="btn-emerald px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                <PlusCircle size={14} /> Create First Course
              </Link>
            </div>
          ) : courses.slice(0, 4).map((course, i) => (
            <div key={course.course_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group mb-1">
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{background:`linear-gradient(135deg,${['#0d4d2d','#0d2d4d','#4d0d2d','#2d4d0d'][i%4]} 0%,#06061a 100%)`}}>
                <BookOpen size={14} className="text-emerald-400/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">{course.course_title}</p>
                <p className="text-xs text-[#9090b8]">{course.level || 'All levels'}</p>
              </div>
              <span className="badge badge-emerald">{course.duration || '–'}h</span>
            </div>
          ))}
        </div>

        {/* Recent submissions */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Recent Submissions</h2>
            <Link to="/instructor/grading" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">Grade <ArrowRight size={12} /></Link>
          </div>
          {submissions.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardCheck size={36} className="text-[#9090b8] mx-auto mb-3 opacity-40" />
              <p className="text-sm text-[#9090b8]">No submissions yet</p>
            </div>
          ) : submissions.slice(0, 5).map(sub => (
            <div key={`${sub.assignment_id}-${sub.user_id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-all mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {sub.user_id}
                </div>
                <div>
                  <p className="text-sm text-white">Assignment #{sub.assignment_id}</p>
                  <p className="text-xs text-[#9090b8]">User #{sub.user_id}</p>
                </div>
              </div>
              {sub.marks != null
                ? <span className="badge badge-emerald">{sub.marks}/100</span>
                : <span className="badge badge-gold">Ungraded</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
