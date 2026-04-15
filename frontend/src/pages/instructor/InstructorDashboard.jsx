import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star, BarChart3, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
=======
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

<<<<<<< HEAD
const COLORS = ['#fbbf24', '#34d399', '#a78bfa', '#f87171', '#60a5fa'];
=======
const GRADE_COLORS = ['#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-white/10 text-xs">
        <p className="text-emerald-400 font-semibold">{label}</p>
        <p className="text-white">{payload[0].value} submissions</p>
      </div>
    );
  }
  return null;
};
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f

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
<<<<<<< HEAD
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
=======
  const avgScore = graded > 0 ? Math.round(submissions.filter(s => s.marks != null).reduce((a, s) => a + s.marks, 0) / graded) : null;

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/instructor/courses' },
    { label: 'Submissions', value: submissions.length, icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/instructor/grading' },
    { label: 'Awaiting Grade', value: ungraded, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/instructor/grading' },
    { label: 'Avg Score', value: avgScore != null ? `${avgScore}%` : '—', icon: Star, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/instructor/grading' },
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f
  ];

  // Bar chart — submissions per assignment
  const assignmentMap = {};
  submissions.forEach(s => {
    const key = `#${s.assignment_id}`;
    assignmentMap[key] = (assignmentMap[key] || 0) + 1;
  });
  const barData = Object.entries(assignmentMap).slice(0, 8).map(([name, count]) => ({ name, count }));

  // Pie chart — grade distribution
  const gradeBuckets = { 'A (90-100)': 0, 'B (75-89)': 0, 'C (60-74)': 0, 'D (50-59)': 0, 'F (<50)': 0 };
  submissions.filter(s => s.marks != null).forEach(s => {
    if (s.marks >= 90) gradeBuckets['A (90-100)']++;
    else if (s.marks >= 75) gradeBuckets['B (75-89)']++;
    else if (s.marks >= 60) gradeBuckets['C (60-74)']++;
    else if (s.marks >= 50) gradeBuckets['D (50-59)']++;
    else gradeBuckets['F (<50)']++;
  });
  const pieData = Object.entries(gradeBuckets).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  return (
<<<<<<< HEAD
    <div className="space-y-8 pb-10">
      {/* ── WELCOME BANNER ── */}
      <div className="relative rounded-3xl p-8 overflow-hidden bg-[#0a0a2a] border border-white/10 shadow-2xl">
=======
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="relative rounded-3xl p-7 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(6,6,26,0.9) 100%)', border: '1px solid rgba(16,185,129,0.15)' }}>
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f
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

<<<<<<< HEAD
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
=======
      {/* Charts */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions per assignment bar chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/[0.06]">
            <div className="mb-5">
              <h2 className="font-display font-semibold text-white text-lg">Submissions by Assignment</h2>
              <p className="text-xs text-[#9090b8] mt-0.5">Number of student submissions per assignment</p>
            </div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#9090b8] text-sm">No submission data yet</div>
            )}
          </div>

          {/* Grade distribution pie chart */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06]">
            <div className="mb-5">
              <h2 className="font-display font-semibold text-white text-lg">Grade Distribution</h2>
              <p className="text-xs text-[#9090b8] mt-0.5">Breakdown of graded submissions</p>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="48%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={GRADE_COLORS[i % GRADE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#9090b8' }} />
                  <Tooltip contentStyle={{ background: 'rgba(6,6,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#9090b8] text-sm">No graded submissions yet</div>
            )}
          </div>
        </div>
      )}

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
                style={{ background: `linear-gradient(135deg,${['#0d4d2d', '#0d2d4d', '#4d0d2d', '#2d4d0d'][i % 4]} 0%,#06061a 100%)` }}>
                <BookOpen size={14} className="text-emerald-400/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">{course.course_title}</p>
                <p className="text-xs text-[#9090b8]">{course.level || 'All levels'}</p>
              </div>
              <span className="badge badge-emerald">{course.duration || '–'}h</span>
            </div>
          ))}
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f
        </div>

        {/* Grade Distribution */}
        <div className="glass rounded-3xl p-7 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <PieIcon size={20} className="text-rose-400" />
            </div>
            <h2 className="font-display font-bold text-white text-xl">Grade Distribution</h2>
          </div>
<<<<<<< HEAD
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
=======
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
                  <p className="text-xs text-[#9090b8]">Student #{sub.user_id}</p>
                </div>
              </div>
              {sub.marks != null
                ? <span className={`badge ${sub.marks >= 75 ? 'badge-emerald' : sub.marks >= 50 ? 'badge-gold' : 'badge-rose'}`}>{sub.marks}/100</span>
                : <span className="badge badge-gold">Ungraded</span>}
            </div>
          ))}
>>>>>>> 5cd5d6beae17ad720f053d74e07a879305d16f8f
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
