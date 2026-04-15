import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import { BookOpen, Award, ClipboardList, TrendingUp, Clock, ArrowRight, Zap, CheckCircle, PlusCircle } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [enrR, asgR, certR, cR, subR] = await Promise.all([
          api.get('/enrollments/me'),
          api.get('/assignments/'),
          api.get('/certificates/me'),
          api.get('/courses/?limit=100'),
          api.get('/submissions/me'),
        ]);
        setEnrollments(enrR.data || []);
        setAssignments(asgR.data || []);
        setCerts(certR.data || []);
        setSubmissions(subR.data || []);
        const m = {}; (cR.data || []).forEach(c => { m[c.course_id] = c; }); setCourses(m);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <PageLoader message="Loading your dashboard..."/>;

  const avgProg = enrollments.length
    ? Math.round(enrollments.reduce((s,e)=>s+(e.progress||0),0)/enrollments.length) : 0;
  const submittedIds = new Set(submissions.map(s=>s.assignment_id));
  const pending = assignments.filter(a=>!submittedIds.has(a.assignment_id));

  // Charts data
  const radialData = [
    {name:'Remaining',value:100-avgProg,fill:'#e2e8f0'},
    {name:'Progress',value:avgProg,fill:'#0d9488'},
  ];
  const progHistory = enrollments.slice(0,6).map((e,i)=>({
    name: courses[e.course_id]?.course_title?.slice(0,10)||`C${i+1}`,
    progress: e.progress||0,
  }));
  const subPie = [
    {name:'Submitted',value:submissions.length,color:'#0d9488'},
    {name:'Pending',  value:pending.length,   color:'#e2e8f0'},
  ].filter(x=>x.value>0);

  const stats = [
    {label:'Enrolled',   value:enrollments.length, icon:BookOpen,  bg:'bg-teal-50 border-teal-200',  color:'text-teal-600',   link:'/student/courses'},
    {label:'Avg Progress',value:`${avgProg}%`,      icon:TrendingUp,bg:'bg-indigo-50 border-indigo-200',color:'text-indigo-600',link:'/student/courses'},
    {label:'Pending Tasks',value:pending.length,    icon:ClipboardList,bg:'bg-amber-50 border-amber-200',color:'text-amber-600',link:'/student/assignments'},
    {label:'Certificates',value:certs.length,       icon:Award,     bg:'bg-emerald-50 border-emerald-200',color:'text-emerald-600',link:'/student/certificates'},
  ];

  const Tip = ({active,payload,label}) => active&&payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-md">
      <p className="text-slate-400">{label}</p><p className="text-teal-700 font-bold">{payload[0].value}%</p>
    </div>
  ) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="rounded-3xl p-7 overflow-hidden relative border border-teal-100"
        style={{background:'linear-gradient(135deg,#f0fdfa 0%,#e0f2fe 100%)'}}>
        <div className="absolute right-6 top-6 opacity-[0.06]"><BookOpen size={120} className="text-teal-700"/></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5"><Zap size={14} className="text-teal-600"/><span className="text-sm text-teal-700 font-semibold">Learning Portal</span></div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 text-sm">{enrollments.length===0?'Start your journey — browse and enroll in a course.':`${pending.length} pending assignment${pending.length!==1?'s':''} need your attention.`}</p>
          </div>
          <Link to="/courses" className="btn-primary px-6 py-2.5 text-sm rounded-xl gap-2 flex-shrink-0 shadow-sm">
            <PlusCircle size={14}/> Enroll New Course
          </Link>
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

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial progress */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Overall Progress</p>
          <div style={{height:160,width:'100%'}}>
            <ResponsiveContainer>
              <RadialBarChart innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270} barSize={14}>
                <RadialBar dataKey="value" cornerRadius={8} background={false}/>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-4">
            <div className="text-4xl font-display font-bold text-teal-600">{avgProg}%</div>
            <div className="text-xs text-slate-400 mt-1">avg across {enrollments.length} course{enrollments.length!==1?'s':''}</div>
          </div>
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:col-span-2 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Progress Per Course</p>
          {progHistory.length > 0 ? (
            <div style={{height:190}}>
              <ResponsiveContainer>
                <AreaChart data={progHistory} margin={{top:5,right:5,left:-25,bottom:0}}>
                  <defs>
                    <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0,100]} tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="progress" stroke="#0d9488" strokeWidth={2} fill="url(#pg)" dot={{fill:'#0d9488',r:3,strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-slate-400">Enroll in courses to see progress</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue learning */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900 text-lg">Continue Learning</h2>
            <Link to="/student/courses" className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1 font-semibold">All <ArrowRight size={11}/></Link>
          </div>
          {enrollments.length===0 ? (
            <div className="text-center py-8">
              <BookOpen size={36} className="text-slate-300 mx-auto mb-3"/>
              <p className="text-sm text-slate-500 mb-4">No courses enrolled yet</p>
              <Link to="/courses" className="btn-primary px-5 py-2 text-xs rounded-xl gap-1.5 inline-flex items-center">Browse Courses</Link>
            </div>
          ) : enrollments.slice(0,4).map(enr=>{
            const course = courses[enr.course_id];
            const prog = enr.progress||0;
            return (
              <Link key={enr.course_id} to={`/student/course/${enr.course_id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={14} className="text-teal-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-teal-600 transition-colors">{course?.course_title||`Course #${enr.course_id}`}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="progress-track flex-1 h-1.5"><div className="progress-fill" style={{width:`${prog}%`,height:'100%'}}/></div>
                    <span className="text-xs text-slate-400 w-8">{prog}%</span>
                  </div>
                </div>
                <ArrowRight size={12} className="text-slate-300 group-hover:text-teal-500 transition-colors"/>
              </Link>
            );
          })}
        </div>

        {/* Pending assignments */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-slate-900 text-lg">Due Assignments</h2>
            <Link to="/student/assignments" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold">All <ArrowRight size={11}/></Link>
          </div>
          {pending.length===0 ? (
            <div className="text-center py-8">
              <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3"/>
              <p className="text-sm text-slate-500">All caught up — no pending work!</p>
            </div>
          ) : pending.slice(0,4).map(a=>(
            <Link key={a.assignment_id} to="/student/assignments"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group mb-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{a.title}</p>
                {a.due_date && <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Clock size={9}/>Due {new Date(a.due_date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p>}
              </div>
              <span className="badge badge-amber">Due</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}