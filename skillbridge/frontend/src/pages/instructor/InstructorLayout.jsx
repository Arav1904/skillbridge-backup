import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardCheck, Users, PlusCircle, LogOut, GraduationCap, Bell, ChevronRight, Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const links = [
  { to: '/instructor', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/instructor/create-course', icon: PlusCircle, label: 'Create Course' },
  { to: '/instructor/grading', icon: ClipboardCheck, label: 'Grading Portal' },
  { to: '/instructor/students', icon: Users, label: 'Students' },
  { to: '/instructor/add-lesson', icon: FileText, label: 'Add Lesson' },
];

export default function InstructorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/'); };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            {user?.name?.[0]?.toUpperCase() || 'I'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name || 'Instructor'}</div>
            <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Instructor</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-[0.12em] text-[#5050a0] px-2 mb-3 font-semibold">Teaching</p>
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active-emerald' : ''}`}>
            <Icon size={15} />{label}
            <ChevronRight size={11} className="ml-auto opacity-25" />
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-emerald-500/10">
        <button onClick={handleLogout} className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/10">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex pt-16">
      <aside className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0 flex-col z-40 hidden lg:flex"
        style={{background:'rgba(4,4,18,0.97)',backdropFilter:'blur(24px)',borderRight:'1px solid rgba(16,185,129,0.08)'}}>
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col z-10"
            style={{background:'rgba(4,4,18,0.99)',borderRight:'1px solid rgba(16,185,129,0.1)'}}>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg btn-ghost"><X size={16}/></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 min-h-full flex flex-col">
        <div className="sticky top-16 z-30 px-5 py-3 flex items-center justify-between"
          style={{background:'rgba(4,4,18,0.92)',backdropFilter:'blur(24px)',borderBottom:'1px solid rgba(16,185,129,0.06)'}}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg btn-ghost" onClick={() => setMobileOpen(true)}>
              <Menu size={16}/>
            </button>
            <div className="flex items-center gap-2 text-sm text-[#7070a0]">
              <GraduationCap size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Instructor Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center relative">
              <Bell size={14}/>
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="flex-1 p-5 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
