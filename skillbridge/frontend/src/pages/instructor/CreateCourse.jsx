import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Save, AlertCircle, Clock, Tag, AlignLeft, Layers } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ course_title: '', description: '', duration: '', category_id: '', instructor_id: '', level: 'Beginner' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/${courseId}`)
      .then(r => { const c = r.data; setForm({ course_title: c.course_title||'', description: c.description||'', duration: c.duration?.toString()||'', category_id: c.category_id?.toString()||'', instructor_id: c.instructor_id?.toString()||'', level: c.level||'Beginner' }); })
      .catch(() => toast('Failed to load course', 'error'))
      .finally(() => setFetching(false));
  }, [courseId]);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.course_title.trim()) e.course_title = 'Course title is required';
    if (form.duration && (isNaN(form.duration) || parseInt(form.duration) < 1)) e.duration = 'Must be a positive number';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      course_title: form.course_title.trim(),
      description: form.description.trim() || null,
      duration: form.duration ? parseInt(form.duration) : null,
      level: form.level,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      instructor_id: form.instructor_id ? parseInt(form.instructor_id) : null,
    };
    try {
      if (isEdit) { await api.put(`/courses/${courseId}`, payload); toast('Course updated!', 'success'); }
      else { await api.post('/courses/', payload); toast('Course created!', 'success'); }
      navigate('/instructor/courses');
    } catch (err) { toast(err.response?.data?.detail || 'Operation failed', 'error'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="flex justify-center py-20"><LoadingSpinner size="lg"/></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/instructor/courses" className="inline-flex items-center gap-2 text-sm text-[#8080a8] hover:text-white transition-colors mb-4"><ArrowLeft size={13}/> Courses</Link>
        <h1 className="text-3xl font-display font-bold text-white">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/[0.06] space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Course Title *</label>
          <div className="relative"><BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
            <input type="text" value={form.course_title} onChange={e=>set('course_title',e.target.value)} placeholder="e.g. Complete Python Bootcamp" className={`input-field pl-10 ${errors.course_title?'error':''}`}/>
          </div>
          {errors.course_title && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={10}/>{errors.course_title}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Description</label>
          <textarea value={form.description} onChange={e=>set('description',e.target.value)} placeholder="What will students learn?" rows={3} className="input-field resize-none"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Duration (hours)</label>
            <div className="relative"><Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
              <input type="number" min="1" value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="e.g. 20" className={`input-field pl-10 ${errors.duration?'error':''}`}/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Category ID</label>
            <div className="relative"><Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
              <input type="number" min="1" value={form.category_id} onChange={e=>set('category_id',e.target.value)} placeholder="e.g. 1" className="input-field pl-10"/>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Difficulty Level</label>
          <div className="flex gap-3">
            {LEVELS.map(l => (
              <button key={l} type="button" onClick={()=>set('level',l)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.level===l?'bg-emerald-400/15 text-emerald-400 border-emerald-400/30':'btn-ghost border-transparent'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Instructor ID</label>
          <div className="relative"><Layers size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
            <input type="number" min="1" value={form.instructor_id} onChange={e=>set('instructor_id',e.target.value)} placeholder="e.g. 1" className="input-field pl-10"/>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link to="/instructor/courses" className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold text-center">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-emerald flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm"/> : <><Save size={14}/>{isEdit?'Update':'Create'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
