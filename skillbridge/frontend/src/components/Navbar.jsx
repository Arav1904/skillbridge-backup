import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, LayoutDashboard, BookOpen, Menu, X, Bell, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const dash = user?.role_id === 2 ? '/instructor' : '/student';
  const isActive = p => location.pathname.startsWith(p);
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || !isLanding ? 'glass border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_18px_rgba(251,191,36,0.28)] group-hover:shadow-[0_0_28px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-all duration-300">
            <GraduationCap size={16} className="text-[#06061a]" strokeWidth={2.5}/>
          </div>
          <span className="font-display font-bold text-[1.1rem] text-white tracking-tight">
            Skill<span className="text-gradient-gold">Bridge</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/courses" className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${
            isActive('/courses') ? 'text-amber-400 bg-amber-400/10' : 'text-[#8080a8] hover:text-white hover:bg-white/[0.05]'}`}>
            <BookOpen size={13}/> Explore
          </Link>
          {user && (
            <Link to={dash} className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${
              isActive(dash)
                ? user.role_id === 2 ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                : 'text-[#8080a8] hover:text-white hover:bg-white/[0.05]'}`}>
              <LayoutDashboard size={13}/> Dashboard
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center relative">
                <Bell size={14}/>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"/>
              </button>
              <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass border ${
                user.role_id === 2 ? 'border-emerald-500/20' : 'border-amber-400/20'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  user.role_id === 2 ? 'bg-gradient-to-br from-emerald-400 to-teal-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}
                  style={user.role_id !== 2 ? {color:'#06061a'} : {}}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-white truncate max-w-[100px]">{user.name}</div>
                  <div className={`text-[10px] font-mono ${user.role_id === 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {user.role_id === 2 ? 'Instructor' : 'Student'}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} title="Sign out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#8080a8] hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-200">
                <LogOut size={13}/>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm btn-ghost font-medium">Sign In</Link>
              <Link to="/register" className="btn-gold px-5 py-2 rounded-xl text-sm font-semibold">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden btn-ghost p-2 rounded-lg" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X size={19}/> : <Menu size={19}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-5 py-4 space-y-1 animate-fade-in">
          <Link to="/courses" className="sidebar-link">
            <BookOpen size={15}/> Explore Courses
          </Link>
          {user && <Link to={dash} className="sidebar-link"><LayoutDashboard size={15}/> Dashboard</Link>}
          {user ? (
            <button onClick={handleLogout} className="sidebar-link w-full text-rose-400 hover:bg-rose-400/10">
              <LogOut size={15}/> Sign Out ({user.name})
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.05]">
              <Link to="/login" className="btn-ghost text-sm py-2.5 px-4 rounded-xl text-center">Sign In</Link>
              <Link to="/register" className="btn-gold text-sm py-2.5 px-4 rounded-xl text-center font-semibold">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
