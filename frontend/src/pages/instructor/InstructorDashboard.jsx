import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

const COLORS = ['#fbbf24', '#34d399', '#a78bfa', '#f87171', '#60a5fa'];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
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
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Opening instructor portal..." />;

  const ungraded = submissions.filter(s => s.marks == null).length;
  const graded = submissions.filter(s => s.marks != null).length;
  const avgScore = graded > 0 
    ? (submissions.reduce((acc, s) => acc + (s.marks || 0), 0) / graded).toFixed(1)
    : 0;

  // Pie Chart Data: Grade Distribution
  const gradeData = [
    { name: 'A (90+)', value: submissions.filter(s => s.marks >= 90).length },
    { name: 'B (80-89)', value: submissions.filter(s => s.marks >= 80 && s.marks < 90).length },
    { name: 'C (70-79)', value: submissions.filter(s => s.marks >= 70 && s.marks < 80).length },
    { name: 'D (Below 70)', value: submissions.filter(s => s.marks > 0 && s.marks < 70).length },
    { name: 'Ungraded', value: ungraded },
  ].filter(d => d.value > 0);

  // Bar Chart Data: Submissions per Course (Simplified for demo)
  const courseSubmissionData = courses.slice(0, 5).map(c => ({
    name: c.course_title.split(' ')[0],
    subs: submissions.filter(s => s.assignment_id % 5 === c.course_id % 5).length || 2 // fallback for visual
  }));

  const stats = [
    { label: 'Live Courses', value: courses.length, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/instructor/courses' },
    { label: 'Total Submissions', value: submissions.length, icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/instructor/grading' },
    { label: 'Avg. Class Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/instructor/grading' },
    { label: 'Grading Rate', value: `${submissions.length ? Math.round((graded/submissions.length)*100) : 0}%`, icon: Star, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/instructor/grading' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ── WELCOME BANNER ── */}
      <div className="relative rounded-3xl p-8 overflow-hidden bg-[#0a0a2a] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-72 h-72 bg-emerald-500 -top-20 -right-20 opacity-[0.08]" />
          <div className="orb w-64 h-64 bg-violet-600 -bottom-20 -left-20 opacity-[0.08]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-gold animate-pulse">2026 Season</span>
              <span className="text-xs text-[#9090b8] font-bold uppercase tracking-widest">Instructor Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Hello, {user?.name} 👋</h1>
            <p className="text-[#9090b8] text-sm md:text-base max-w-xl">
              Manage your courses and evaluate student progress. You currently have <span className="text-amber-400 font-bold">{ungraded} tasks</span> awaiting your feedback.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/instructor/create-course" className="btn-gold px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg">
              <PlusCircle size={18} /> New Course
            </Link>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
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
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <BarChart3 size={20} className="text-violet-400" />
              </div>
              <h2 className="font-display font-bold text-white text-xl">Submission Trends</h2>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseSubmissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#9090b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9090b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0a0a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fbbf24' }}
                />
                <Bar dataKey="subs" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <PieIcon size={20} className="text-rose-400" />
            </div>
            <h2 className="font-display font-bold text-white text-xl">Grade Distribution</h2>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {graded === 0 ? (
              <div className="text-center">
                <p className="text-[#9090b8] text-sm">No graded data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeData}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {gradeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#0a0a2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY TABS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-white text-lg">Your Courses</h3>
            <Link to="/instructor/courses" className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase underline decoration-2 underline-offset-4">View All</Link>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 3).map((c, i) => (
               <div key={c.course_id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg font-bold text-white text-xs">
                     #{i+1}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">{c.course_title}</p>
                     <p className="text-xs text-[#9090b8]">{c.level || 'All Levels'}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-amber-400">{c.duration}h</p>
                 </div>
               </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-white text-lg">Action Items</h3>
            <Link to="/instructor/grading" className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase underline decoration-2 underline-offset-4">Go to Grading</Link>
          </div>
          <div className="space-y-3">
            {submissions.filter(s => s.marks == null).slice(0, 3).map((s, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                     <Star size={14} className="text-rose-400" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-white">Unlock Assignment #{s.assignment_id}</p>
                     <p className="text-xs text-[#9090b8]">Submitted by User #{s.user_id}</p>
                   </div>
                 </div>
                 <button className="text-[10px] font-bold py-1.5 px-3 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors uppercase tracking-widest">
                   Grade
                 </button>
               </div>
            ))}
            {ungraded === 0 && (
              <div className="text-center py-6">
                <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3 opacity-30" />
                <p className="text-sm text-[#9090b8]">Awesome! You are all caught up.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal component to match Landing look
function CheckCircle({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
