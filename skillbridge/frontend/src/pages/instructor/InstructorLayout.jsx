import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardCheck, Users, PlusCircle, LogOut, GraduationCap, Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const links = [
  { to: '/instructor',                  icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/instructor/courses',          icon: BookOpen,        label: 'My Courses'                 },
  { to: '/instructor/create-course',    icon: PlusCircle,      label: 'Create Course'              },
  { to: '/instructor/grading',          icon: ClipboardCheck,  label: 'Grading Portal'             },
  { to: '/instructor/students',         icon: Users,           label: 'Students'                   },
  { to: '/instructor/add-lesson',       icon: FileText,        label: 'Add Lesson'                 },
  { to: '/instructor/create-assignment',icon: FileText,        label: 'New Assignment'             },
];

export default function InstructorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mob, setMob] = useState(false);

  const SidebarContent = ({ onClose }) => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{user?.name}</div>
            <div className="text-xs font-semibold text-indigo-600">Instructor</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 px-2 mb-3 font-semibold">Teaching</p>
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Icon size={15}/>{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 w-full transition-colors">
          <LogOut size={15}/> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen pt-16 bg-slate-50">
      <aside className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 hidden lg:flex flex-col z-40">
        <SidebarContent/>
      </aside>
      {mob && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMob(false)}/>
          <aside className="relative w-72 shadow-2xl z-10 flex flex-col">
            <button onClick={() => setMob(false)} className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-100 z-10"><X size={16}/></button>
            <SidebarContent onClose={() => setMob(false)}/>
          </aside>
        </div>
      )}
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600" onClick={() => setMob(true)}><Menu size={16}/></button>
            <span className="text-sm text-slate-500 flex items-center gap-1.5">
              <GraduationCap size={14} className="text-indigo-600"/> Instructor Portal
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</div>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-7"><Outlet/></div>
      </main>
    </div>
  );
}
