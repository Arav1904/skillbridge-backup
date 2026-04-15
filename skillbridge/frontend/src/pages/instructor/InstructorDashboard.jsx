import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

const GRADE_COLORS = ['#0d9488','#6366f1','#f59e0b','#f43f5e','#94a3b8'];

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/courses/?limit=100'), api.get('/submissions/')])
      .then(([cR, sR]) => { setCourses(cR.data||[]); setSubmissions(sR.data||[]); })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Loading instructor dashboard..."/>;

  const ungraded = submissions.filter(s=>s.marks==null).length;
  const graded   = submissions.filter(s=>s.marks!=null).length;
  const avgScore = graded > 0
    ? Math.round(submissions.filter(s=>s.marks!=null).reduce((a,s)=>a+s.marks,0)/graded) : 0;

  // Grade distribution for pie
  const gradeRanges = [
    {name:'90–100',count:submissions.filter(s=>s.marks>=90).length,           color:GRADE_COLORS[0]},
    {name:'70–89', count:submissions.filter(s=>s.marks>=70&&s.marks<90).length,color:GRADE_COLORS[1]},
    {name:'50–69', count:submissions.filter(s=>s.marks>=50&&s.marks<70).length,color:GRADE_COLORS[2]},
    {name:'0–49',  count:submissions.filter(s=>s.marks!=null&&s.marks<50).length,color:GRADE_COLORS[3]},
  ].filter(r=>r.count>0);

  // Bar chart data — last 8 submissions
  const barData = submissions.slice(-8).map(s=>({
    name:`#${s.assignment_id}`,
    marks: s.marks ?? 0,
    graded: s.marks!=null,
  }));

  const stats = [
    {label:'My Courses',    value:courses.length,    icon:BookOpen,     bg:'bg-teal-50 border-teal-200',    color:'text-teal-600',   link:'/instructor/courses'},
    {label:'Submissions',   value:submissions.length,icon:ClipboardCheck,bg:'bg-indigo-50 border-indigo-200',color:'text-indigo-600', link:'/instructor/grading'},
    {label:'Needs Grading', value:ungraded,          icon:TrendingUp,   bg:'bg-amber-50 border-amber-200',  color:'text-amber-600',  link:'/instructor/grading'},
    {label:'Avg Score',     value:avgScore?`${avgScore}%`:'—',icon:Star,bg:'bg-rose-50 border-rose-200',    color:'text-rose-600',   link:'/instructor/grading'},
  ];

  const Tip = ({active,payload,label}) => active&&payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-md">
      <p className="text-slate-400">{label}</p>
      <p className="text-teal-700 font-bold">{payload[0].value}/100</p>
    </div>
  ) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="rounded-3xl p-7 relative overflow-hidden border border-teal-100"
        style={{background:'linear-gradient(135deg,#ecfdf5 0%,#e0f2fe 100%)'}}>
        <div className="absolute right-6 top-6 opacity-[0.06]"><Users size={120} className="text-teal-700"/></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5"><Zap size={14} className="text-teal-600"/><span className="text-sm text-teal-700 font-semibold">Instructor Portal</span></div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Welcome, {user?.name?.split(' ')[0]} 🎓</h1>
            <p className="text-slate-500 text-sm">{ungraded>0?`${ungraded} submission${ungraded>1?'s':''} awaiting your grades.`:'All submissions graded — great work!'}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/instructor/create-course" className="btn-primary px-5 py-2.5 text-sm rounded-xl gap-2 shadow-sm">
              <PlusCircle size={14}/> New Course
            </Link>
            {ungraded>0 && <Link to="/instructor/grading" className="btn-secondary px-5 py-2.5 text-sm rounded-xl gap-2">
              <ClipboardCheck size={14}/> Grade Now
            </Link>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({label,value,icon:Icon,bg,color,link})=>(
          <Link key={label} to={link} className={`stat-card border ${bg} hover:shadow-md hover:-translate-y-1`}>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 bg-white ${bg}`}><Icon size={16} className={color}/></div>
            <div className="text-2xl font-display font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade distribution pie */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Grade Distribution</p>
          {gradeRanges.length > 0 ? (
            <div style={{height:220}}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={gradeRanges} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={44} paddingAngle={4} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {gradeRanges.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:10,fontSize:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">No graded submissions yet</div>
          )}
        </div>

        {/* Submission scores bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Scores</p>
            <Link to="/instructor/grading" className="text-xs text-teal-600 font-semibold flex items-center gap-1">Grade all <ArrowRight size={10}/></Link>
          </div>
          {barData.length > 0 ? (
            <div style={{height:200}}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{top:5,right:5,left:-25,bottom:0}}>
                  <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="marks" radius={[5,5,0,0]}>
                    {barData.map((e,i)=><Cell key={i} fill={e.graded?'#0d9488':'#e2e8f0'} fillOpacity={0.85}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">No submissions yet</div>
          )}
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900 text-lg">My Courses</h2>
            <Link to="/instructor/courses" className="text-xs text-teal-600 font-semibold flex items-center gap-1">All <ArrowRight size={11}/></Link>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={36} className="text-slate-300 mx-auto mb-3"/>
              <p className="text-sm text-slate-500 mb-4">No courses yet</p>
              <Link to="/instructor/create-course" className="btn-primary px-5 py-2 text-xs rounded-xl gap-1.5 inline-flex items-center"><PlusCircle size={12}/>Create First</Link>
            </div>
          ) : courses.slice(0,5).map((c,i)=>(
            <div key={c.course_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all mb-1">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                <BookOpen size={14} className="text-teal-600"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{c.course_title}</p>
                <p className="text-xs text-slate-400">{c.level||'All levels'} · {c.duration||'?'}h</p>
              </div>
              <span className={`badge ${c.level?.toLowerCase()==='advanced'?'badge-rose':c.level?.toLowerCase()==='intermediate'?'badge-amber':'badge-teal'}`}>
                {c.level?.slice(0,3)||'N/A'}
              </span>
            </div>
          ))}
        </div>

        {/* Recent submissions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900 text-lg">Recent Submissions</h2>
            <Link to="/instructor/grading" className="text-xs text-amber-600 font-semibold flex items-center gap-1">Grade <ArrowRight size={11}/></Link>
          </div>
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardCheck size={36} className="text-slate-300 mx-auto mb-3"/>
              <p className="text-sm text-slate-500">No submissions yet</p>
            </div>
          ) : submissions.slice(0,5).map(sub=>(
            <div key={`${sub.assignment_id}-${sub.user_id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{sub.user_id}</div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Asgn #{sub.assignment_id}</p>
                  <p className="text-xs text-slate-400">User #{sub.user_id}</p>
                </div>
              </div>
              {sub.marks!=null
                ? <span className={`badge ${sub.marks>=80?'badge-teal':sub.marks>=50?'badge-amber':'badge-rose'}`}>{sub.marks}/100</span>
                : <span className="badge badge-indigo">Ungraded</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}