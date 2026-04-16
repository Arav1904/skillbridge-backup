import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, LayoutDashboard, BookOpen, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, {passive:true});
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dash = user?.role_id === 2 ? '/instructor' : '/student';
  const active = p => loc.pathname.startsWith(p);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b border-slate-200 transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform" style={{background:'linear-gradient(135deg,#0d9488,#0284c7)'}}>
            <GraduationCap size={18} className="text-white" strokeWidth={2.5}/>
          </div>
          <span className="text-[1.15rem] font-bold text-slate-900" style={{fontFamily:"'Instrument Serif',serif"}}>
            Skill<span style={{background:'linear-gradient(135deg,#0d9488,#0ea5e9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Bridge</span>
          </span>
        </Link>

        {/* Centre links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/courses" className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${active('/courses')?'bg-teal-50 text-teal-700':'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <BookOpen size={14}/> Explore
          </Link>
          {user && (
            <Link to={dash} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${active(dash)?(user.role_id===2?'bg-indigo-50 text-indigo-700':'bg-teal-50 text-teal-700'):'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <LayoutDashboard size={14}/> Dashboard
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium ${user.role_id===2?'bg-indigo-50 border-indigo-200':'bg-teal-50 border-teal-200'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${user.role_id===2?'bg-indigo-600':'bg-teal-600'}`}>{user.name?.[0]?.toUpperCase()}</div>
                <div className="leading-tight">
                  <div className="text-slate-800 font-semibold truncate max-w-[90px]">{user.name}</div>
                  <div className={`text-[10px] font-bold ${user.role_id===2?'text-indigo-600':'text-teal-600'}`}>{user.role_id===2?'Instructor':'Student'}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors">
                <LogOut size={13}/> Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">Sign In</Link>
              <Link to="/register" className="px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:-translate-y-0.5" style={{background:'linear-gradient(135deg,#0d9488,#0f766e)'}}>Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" onClick={()=>setOpen(o=>!o)}>
          {open?<X size={18}/>:<Menu size={18}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1">
          <Link to="/courses" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"><BookOpen size={14}/> Explore Courses</Link>
          {user && <Link to={dash} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"><LayoutDashboard size={14}/> Dashboard</Link>}
          {user
            ? <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 w-full"><LogOut size={14}/> Sign Out</button>
            : <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Link to="/login" className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">Sign In</Link>
                <Link to="/register" className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold text-white" style={{background:'linear-gradient(135deg,#0d9488,#0f766e)'}}>Get Started</Link>
              </div>
          }
        </div>
      )}
    </nav>
  );
}
