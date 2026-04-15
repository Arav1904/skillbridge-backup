import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadialBarChart, RadialBar
} from 'recharts';
import {
  ArrowRight, Star, Users, BookOpen, Award, CheckCircle, TrendingUp,
  Zap, Shield, Globe, Brain, Code, Palette, BarChart3, ChevronRight,
  GraduationCap, Play, Database, GitBranch, Layers
} from 'lucide-react';
import api from '../../api';
import CourseCard from '../../components/CourseCard';

const growthData = [
  {m:'Jan',v:3200},{m:'Feb',v:4100},{m:'Mar',v:5800},{m:'Apr',v:6400},
  {m:'May',v:7900},{m:'Jun',v:9100},{m:'Jul',v:10400},{m:'Aug',v:11200},{m:'Sep',v:12400},
];
const catData = [
  {name:'Dev',courses:87,color:'#0d9488'},
  {name:'Design',courses:54,color:'#8b5cf6'},
  {name:'Business',courses:63,color:'#f59e0b'},
  {name:'AI & Data',courses:48,color:'#3b82f6'},
];
const crudOps = [
  {op:'CREATE',desc:'Register users, enroll in courses, submit assignments, post lessons',color:'bg-emerald-50 border-emerald-200 text-emerald-700',dot:'bg-emerald-500'},
  {op:'READ',  desc:'Browse courses, view dashboard stats, see grades & certificates',color:'bg-blue-50 border-blue-200 text-blue-700',dot:'bg-blue-500'},
  {op:'UPDATE',desc:'Update course progress, edit courses, grade submissions with marks',color:'bg-amber-50 border-amber-200 text-amber-700',dot:'bg-amber-500'},
  {op:'DELETE',desc:'Delete courses, unenroll from courses, revoke certificates',color:'bg-rose-50 border-rose-200 text-rose-700',dot:'bg-rose-500'},
];

function useCountUp(target, go) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let st = null;
    const step = ts => {
      if (!st) st = ts;
      const p = Math.min((ts - st) / 2000, 1);
      setN(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, go]);
  return n;
}

function StatCard({ s, go }) {
  const n = useCountUp(s.value, go);
  return (
    <div className={`rounded-2xl p-5 text-center border ${s.bg} hover:shadow-md transition-all cursor-default`}>
      <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
      <div className="text-2xl font-display font-bold text-slate-900">{n.toLocaleString()}{s.suffix}</div>
      <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
    </div>
  );
}

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const [vis, setVis] = useState({});
  const refs = useRef({});

  useEffect(() => {
    api.get('/courses/?limit=6').then(r => setCourses(r.data || [])).catch(() => {});
  }, []);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVis(p => ({ ...p, [e.target.id]: true })); });
    }, { threshold: 0.1 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  const r = id => el => { refs.current[id] = el; };

  const stats = [
    {label:'Active Learners',value:12400,suffix:'+',icon:Users,color:'text-teal-600',bg:'bg-teal-50 border-teal-200'},
    {label:'Expert Courses', value:340,  suffix:'+',icon:BookOpen,color:'text-indigo-600',bg:'bg-indigo-50 border-indigo-200'},
    {label:'Certificates',   value:8900, suffix:'+',icon:Award,  color:'text-amber-600',bg:'bg-amber-50 border-amber-200'},
    {label:'Completion Rate',value:94,   suffix:'%', icon:TrendingUp,color:'text-emerald-600',bg:'bg-emerald-50 border-emerald-200'},
  ];

  const CustomTip = ({ active, payload, label }) => active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400">{label}</p>
      <p className="text-teal-700 font-bold">{payload[0].value.toLocaleString()} learners</p>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{background:'linear-gradient(160deg,#f0fdfa 0%,#ffffff 40%,#eef2ff 100%)'}}/>
          <div className="absolute top-20 -right-20 w-96 h-96 rounded-full opacity-40" style={{background:'radial-gradient(circle,#ccfbf1 0%,transparent 70%)'}}/>
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full opacity-30" style={{background:'radial-gradient(circle,#e0e7ff 0%,transparent 70%)'}}/>
          <div className="absolute inset-0 opacity-[0.025]" style={{backgroundImage:'linear-gradient(#0d9488 1px,transparent 1px),linear-gradient(90deg,#0d9488 1px,transparent 1px)',backgroundSize:'64px 64px'}}/>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold mb-8 animate-fade-up">
            <Zap size={13} className="text-teal-500"/> India's most modern DBMS-powered learning platform
            <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">NEW</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 leading-[1.04] mb-6 animate-fade-up delay-100">
            Find Your<br/>
            <span className="text-gradient-teal italic">Next Skill.</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            A relational database-powered learning platform. Every course, enrollment, assignment, and certificate — complete CRUD operations on real PostgreSQL data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Link to="/register"
              className="btn-primary px-10 py-4 text-base rounded-xl gap-2.5 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30">
              Start Learning Free <ArrowRight size={17}/>
            </Link>
            <Link to="/courses"
              className="btn-secondary px-8 py-4 text-base rounded-xl gap-2.5 flex items-center">
              <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center">
                <Play size={11} className="text-teal-700 ml-0.5"/>
              </div>
              Browse Courses
            </Link>
          </div>

          {/* Stats */}
          <div id="stats" ref={r('stats')}
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 ${vis.stats?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>
            {stats.map(s => <StatCard key={s.label} s={s} go={!!vis.stats}/>)}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-xs animate-pulse-soft">
          <span className="font-medium">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-slate-200 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-teal-400 rounded-full animate-bounce"/>
          </div>
        </div>
      </section>

      {/* ── CRUD SHOWCASE ── */}
      <section id="crud" ref={r('crud')} className="py-20 px-6 bg-slate-50">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.crud?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono font-semibold mb-4">
              <Database size={13}/> PostgreSQL · SQLAlchemy ORM · FastAPI
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Complete CRUD<br/><span className="text-gradient-teal">Operations</span></h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Every feature maps to real database operations on a normalized PostgreSQL schema with 10 tables and full relational integrity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {crudOps.map(({op,desc,color,dot}) => (
              <div key={op} className={`rounded-2xl p-5 border flex gap-4 hover:shadow-sm transition-all ${color}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 text-white ${dot}`}>{op}</div>
                <div>
                  <div className="font-bold text-sm mb-1">{op}</div>
                  <div className="text-xs opacity-75 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Schema mini-diagram */}
          <div className="bg-slate-900 rounded-2xl p-6 text-xs font-mono text-slate-300 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-400">
              <GitBranch size={13}/> <span className="text-slate-300 font-semibold">Database Schema</span>
              <span className="ml-auto text-slate-500">10 tables · FK constraints · Normalized</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              {['users','roles','courses','categories','instructors','enrollment','lessons','assignments','submissions','certificates'].map(t => (
                <div key={t} className="bg-slate-800 rounded-lg px-3 py-2 text-teal-400 border border-slate-700">{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GROWTH CHART ── */}
      <section id="chart" ref={r('chart')} className="py-20 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.chart?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge badge-teal mb-4">Platform Analytics</span>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Growing Faster<br/><span className="text-gradient-teal">Than Ever</span></h2>
              <p className="text-slate-500 leading-relaxed mb-6">From 3,200 learners in January to 12,400 by September — driven entirely by word-of-mouth and student results.</p>
              <div className="grid grid-cols-2 gap-3">
                {[{l:'MoM Growth',v:'+23%',c:'text-teal-600',bg:'bg-teal-50 border-teal-200'},{l:'Retention',v:'91%',c:'text-indigo-600',bg:'bg-indigo-50 border-indigo-200'},{l:'Avg Session',v:'47min',c:'text-violet-600',bg:'bg-violet-50 border-violet-200'},{l:'NPS Score',v:'72',c:'text-amber-600',bg:'bg-amber-50 border-amber-200'}].map(({l,v,c,bg})=>(
                  <div key={l} className={`rounded-xl p-3.5 border ${bg}`}>
                    <div className={`text-2xl font-display font-bold ${c}`}>{v}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" style={{height:'260px'}}>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Student Growth 2024</p>
              <ResponsiveContainer width="100%" height="87%">
                <AreaChart data={growthData} margin={{top:5,right:5,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTip/>}/>
                  <Area type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2.5} fill="url(#tg)" dot={{fill:'#0d9488',r:3,strokeWidth:0}} activeDot={{r:5}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES + BAR CHART ── */}
      <section id="cats" ref={r('cats')} className="py-20 px-6 bg-slate-50">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.cats?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <span className="badge badge-indigo mb-4">Categories</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Every Field. <span className="text-gradient-indigo">One Platform.</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[{n:'Development',icon:Code,c:87,from:'#0d9488',to:'#0284c7'},{n:'Design',icon:Palette,c:54,from:'#8b5cf6',to:'#ec4899'},{n:'Business',icon:BarChart3,c:63,from:'#f59e0b',to:'#ef4444'},{n:'AI & Data',icon:Brain,c:48,from:'#10b981',to:'#0d9488'}].map(({n,icon:I,c,from,to},i)=>(
              <Link to="/courses" key={n} className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md"
                  style={{background:`linear-gradient(135deg,${from},${to})`}}>
                  <I size={24} className="text-white"/>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-0.5">{n}</h3>
                <p className="text-xs text-slate-500">{c} courses</p>
              </Link>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm" style={{height:'200px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} margin={{top:5,right:5,left:-20,bottom:0}}>
                <XAxis dataKey="name" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:'#fff',border:'1px solid #e2e8f0',borderRadius:10,fontSize:12,boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}}/>
                <Bar dataKey="courses" radius={[6,6,0,0]}>
                  {catData.map((e,i)=><Cell key={i} fill={e.color} fillOpacity={0.85}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section id="featured" ref={r('featured')} className="py-20 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.featured?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge badge-teal mb-4">Featured</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Trending <span className="text-gradient-teal">Courses</span></h2>
            </div>
            <Link to="/courses" className="hidden md:flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-semibold group">
              See all <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform"/>
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c,i)=>(
                <div key={c.course_id} className="animate-fade-up" style={{animationDelay:`${i*70}ms`,animationFillMode:'both'}}>
                  <CourseCard course={c} index={i}/>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_,i)=><div key={i} className="h-72 rounded-2xl animate-shimmer"/>)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/courses" className="btn-secondary px-8 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              Explore All Courses <ArrowRight size={15}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={r('features')} className="py-20 px-6 bg-slate-50">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.features?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-14">
            <span className="badge badge-emerald mb-4">Why SkillBridge</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Built Different.<br/><span className="text-gradient-teal">For Real Results.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {icon:Zap,title:'AI-Powered Paths',desc:'Adaptive learning that adjusts to your pace and fills skill gaps automatically.',c:'text-teal-600',bg:'bg-teal-50 border-teal-200'},
              {icon:Shield,title:'Verified Certificates',desc:'Blockchain-timestamped credentials. Share to LinkedIn with one click.',c:'text-indigo-600',bg:'bg-indigo-50 border-indigo-200'},
              {icon:Globe,title:'Live Cohort Sessions',desc:'Weekly live classes with instructors and peers — never learn alone.',c:'text-violet-600',bg:'bg-violet-50 border-violet-200'},
              {icon:Brain,title:'24-Hour Grading',desc:'AI-assisted tools help instructors grade and give feedback within a day.',c:'text-rose-600',bg:'bg-rose-50 border-rose-200'},
            ].map(({icon:I,title,desc,c,bg})=>(
              <div key={title} className={`rounded-2xl p-7 border flex gap-5 hover:shadow-md transition-all ${bg}`}>
                <div className={`w-11 h-11 rounded-xl border bg-white flex items-center justify-center flex-shrink-0 ${bg}`}><I size={20} className={c}/></div>
                <div>
                  <h3 className="font-display font-semibold text-slate-800 text-lg mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testi" ref={r('testi')} className="py-20 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${vis.testi?'opacity-100 translate-y-0':'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-14">
            <span className="badge badge-rose mb-4">Student Stories</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Real People. <em className="text-gradient-teal">Real Results.</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {n:'Priya Sharma',r:'SWE @ Google',t:'SkillBridge gave me the structured path I was missing. Landed my dream job 4 months after the Dev track.',a:'PS',c:'bg-teal-600'},
              {n:'Rahul Mehta',r:'UX Designer @ Razorpay',t:'The design curriculum is world-class. Every assignment got genuine, actionable feedback within 24 hours.',a:'RM',c:'bg-indigo-600'},
              {n:'Ananya Iyer',r:'Data Analyst @ Flipkart',t:'I went from spreadsheet basics to building ML pipelines. The certificate got me the interview.',a:'AI',c:'bg-violet-600'},
            ].map(({n,r,t,a,c})=>(
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} size={13} className="text-amber-400" fill="currentColor"/>)}</div>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${c} flex items-center justify-center text-white text-xs font-bold`}>{a}</div>
                  <div><div className="text-sm font-semibold text-slate-800">{n}</div><div className="text-xs text-slate-500">{r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden" style={{background:'linear-gradient(135deg,#0d9488 0%,#0284c7 100%)'}}>
            <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 20% 50%,white 0%,transparent 50%)'}}/>
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-6">
                Free to Start
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Ready to level up?</h2>
              <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">Join 12,000+ students. No credit card. Cancel any time.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="bg-white text-teal-700 font-bold px-10 py-4 rounded-xl text-base hover:bg-teal-50 transition-all shadow-lg flex items-center gap-2.5">
                  Create Free Account <ArrowRight size={17}/>
                </Link>
                <div className="flex items-center gap-2 text-sm text-teal-100">
                  <CheckCircle size={14}/> No credit card needed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#0d9488,#0284c7)'}}>
              <GraduationCap size={14} className="text-white"/>
            </div>
            <span className="font-display font-bold text-slate-800">Skill<span className="text-gradient-teal">Bridge</span></span>
          </div>
          <p className="text-xs text-slate-400 text-center">© 2024 SkillBridge · DBMS Lab Project · PostgreSQL + FastAPI + React</p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link to="/login" className="hover:text-teal-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-teal-600 transition-colors">Register</Link>
            <Link to="/courses" className="hover:text-teal-600 transition-colors">Courses</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}