import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Edit3, Trash2, Clock, Search, X } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

const levelColors = { beginner: 'badge-emerald', intermediate: 'badge-gold', advanced: 'badge-rose' };

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/courses/?limit=100').then(r => setCourses(r.data || [])).catch(() => toast('Failed to load courses','error')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(p => p.filter(c => c.course_id !== id));
      toast('Course deleted', 'success');
    } catch (err) { toast(err.response?.data?.detail || 'Delete failed', 'error'); }
  };

  const filtered = courses.filter(c => !search || c.course_title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageLoader message="Loading courses..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Course Management</h1>
          <p className="text-[#8080a8] text-sm mt-1">{courses.length} course{courses.length!==1?'s':''}</p>
        </div>
        <Link to="/instructor/create-course" className="btn-emerald px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <PlusCircle size={14}/> Create Course
        </Link>
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-3 border border-white/[0.05]">
        <Search size={14} className="text-[#7070a0] flex-shrink-0"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#5050a0]"/>
        {search && <button onClick={()=>setSearch('')}><X size={13} className="text-[#7070a0] hover:text-white"/></button>}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <BookOpen size={56} className="text-emerald-400/25 mx-auto mb-6 animate-float"/>
          <h2 className="text-2xl font-display font-bold text-white mb-3">{courses.length===0?'No courses yet':'No results'}</h2>
          <p className="text-[#8080a8] mb-8">{courses.length===0?'Create your first course to start teaching.':'Try a different search.'}</p>
          {courses.length===0 && <Link to="/instructor/create-course" className="btn-emerald px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2"><PlusCircle size={15}/>Create First Course</Link>}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.02)'}}>
                  {['#','Title','Level','Duration','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#7070a0] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((c, i) => (
                  <tr key={c.course_id} className="hover:bg-white/[0.02] transition-colors group animate-fade-up"
                    style={{animationDelay:`${Math.min(i,10)*25}ms`,animationFillMode:'both'}}>
                    <td className="px-5 py-4 text-xs text-[#5050a0] font-mono">{c.course_id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={13} className="text-emerald-400"/>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors line-clamp-1">{c.course_title}</p>
                          {c.description && <p className="text-xs text-[#7070a0] line-clamp-1 max-w-xs">{c.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={`badge ${levelColors[(c.level||'').toLowerCase()]||'badge-blue'}`}>{c.level||'N/A'}</span></td>
                    <td className="px-5 py-4 text-sm text-[#7070a0]">{c.duration?<span className="flex items-center gap-1"><Clock size={11}/>{c.duration}h</span>:'—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link to={`/instructor/edit-course/${c.course_id}`} className="p-2 rounded-lg hover:bg-emerald-400/10 text-[#7070a0] hover:text-emerald-400 transition-all"><Edit3 size={13}/></Link>
                        <button onClick={()=>handleDelete(c.course_id)} className="p-2 rounded-lg hover:bg-rose-400/10 text-[#7070a0] hover:text-rose-400 transition-all"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(c => (
              <div key={c.course_id} className="card p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${levelColors[(c.level||'').toLowerCase()]||'badge-blue'}`}>{c.level||'N/A'}</span>
                    <span className="text-[10px] text-[#5050a0] font-mono">#{c.course_id}</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{c.course_title}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Link to={`/instructor/edit-course/${c.course_id}`} className="p-2 rounded-lg hover:bg-emerald-400/10 text-[#7070a0] hover:text-emerald-400"><Edit3 size={13}/></Link>
                  <button onClick={()=>handleDelete(c.course_id)} className="p-2 rounded-lg hover:bg-rose-400/10 text-[#7070a0] hover:text-rose-400"><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
