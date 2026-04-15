import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, ClipboardList, TrendingUp, Clock, Star, ArrowRight, Zap, CheckCircle, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [enrRes, asgRes, certRes, coursesRes] = await Promise.all([
          api.get('/enrollments/me'),
          api.get('/assignments/'),
          api.get('/certificates/me'),
          api.get('/courses/?limit=100'),
        ]);
        setEnrollments(enrRes.data);
        setAssignments(asgRes.data);
        setCerts(certRes.data);
        const cMap = {};
        coursesRes.data.forEach(c => { cMap[c.course_id] = c; });
        setCourses(cMap);
      } catch (e) {
        console.error('Student dashboard error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Opening your learning portal..." />;

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;

  // Chart Data: Progress per Course
  const progressData = enrollments.slice(0, 5).map(e => ({
    name: courses[e.course_id]?.course_title.split(' ')[0] || `Course ${e.course_id}`,
    uv: e.progress || 0,
    pv: 100, // max
  }));

  // Radial Chart Data: Overall Mastery
  const radialData = [
    { name: 'Overall Progress', value: avgProgress, fill: '#fbbf24' },
  ];

  const stats = [
    { label: 'Courses Active', value: enrollments.length, icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/student/courses' },
    { label: 'Total Mastery', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/student/courses' },
    { label: 'Pending Tasks', value: assignments.length, icon: ClipboardList, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/student/assignments' },
    { label: 'Earned Certs', value: certs.length, icon: Award, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/student/certificates' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── WELCOME BANNER ── */}
      <div className="relative rounded-3xl p-8 overflow-hidden bg-[#0d0d2a] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-80 h-80 bg-amber-500 -top-24 -right-24 opacity-[0.08]" />
          <div className="orb w-72 h-72 bg-violet-600 -bottom-24 -left-24 opacity-[0.08]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-gold">2026 Student</span>
              <span className="text-xs text-[#9090b8] font-bold uppercase tracking-widest">SkillBridge Academy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Welcome back, {user?.name} 🌊</h1>
            <p className="text-[#9090b8] text-sm md:text-base max-w-xl leading-relaxed">
              Track your daily learning progress and achievements. You have <span className="text-violet-400 font-bold">{assignments.length} assignments</span> to complete this week.
            </p>
          </div>
          <Link to="/courses" className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg group">
            <span>Explore More</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className={`stat-card border ${bg} transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-12 h-12 rounded-2xl ${bg} border flex items-center justify-center mb-4 shadow-inner`}><Icon size={20} className={color} /></div>
            <div className="text-3xl font-display font-bold text-white tracking-tight">{value}</div>
            <div className="text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mt-2">{label}</div>
          </Link>
        ))}
      </div>

      {/* ── CHARTS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <BarChart3 size={20} className="text-amber-400" />
            </div>
            <h2 className="font-display font-bold text-white text-xl">Learning Progress</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#9090b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9090b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ background: '#0a0a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="uv" stroke="#fbbf24" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-7 border border-white/10 flex flex-col items-center justify-center text-center">
            <h2 className="font-display font-bold text-white text-xl mb-6 w-full text-left">Overall Mastery</h2>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" barSize={20} data={radialData} startAngle={180} endAngle={-180}>
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[#9090b8] text-sm mt-4 italic">"{avgProgress >= 50 ? 'You are over the hump! Focus on completion.' : 'Starting strong is half the battle won.'}"</p>
        </div>
      </div>

      {/* ── COURSE LIST ── */}
      <div className="glass rounded-3xl p-7 border border-white/10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="font-display font-bold text-white text-xl">Continue Learning</h3>
           <Link to="/student/courses" className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase flex items-center gap-2">View All Active <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {enrollments.slice(0, 3).map((enr, i) => {
             const course = courses[enr.course_id];
             return (
               <div key={enr.course_id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-600/30">
                      <BookOpen size={18} className="text-violet-400" />
                    </div>
                    <span className="text-xs font-bold text-[#9090b8]">{enr.progress || 0}%</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-4 line-clamp-1 group-hover:text-amber-400 transition-colors">{course?.course_title || 'Expert Course'}</h4>
                  <div className="progress-track h-2 mb-5">
                    <div className="progress-fill" style={{width: `${enr.progress || 0}%`}} />
                  </div>
                  <Link to={`/student/course-viewer/${enr.course_id}`} className="btn-ghost w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 group/btn">
                    Continue <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}
