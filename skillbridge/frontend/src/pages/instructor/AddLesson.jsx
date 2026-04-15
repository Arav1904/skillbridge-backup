import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Clock, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddLesson() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ course_id: '', lesson_title: '', lesson_content: '', lesson_duration: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => { api.get('/courses/?limit=100').then(r => setCourses(r.data||[])).catch(()=>{}); }, []);

  const set = (f,v) => { setForm(p=>({...p,[f]:v})); setErrors(p=>({...p,[f]:''})); };

  const validate = () => {
    const e = {};
    if (!form.course_id) e.course_id = 'Select a course';
    if (!form.lesson_title.trim()) e.lesson_title = 'Lesson title is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/lessons/', { course_id: parseInt(form.course_id), lesson_title: form.lesson_title.trim(), lesson_content: form.lesson_content.trim()||null, lesson_duration: form.lesson_duration?parseInt(form.lesson_duration):null });
      toast('Lesson added!', 'success');
      navigate('/instructor/courses');
    } catch (err) { toast(err.response?.data?.detail||'Failed to add lesson','error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/instructor/courses" className="inline-flex items-center gap-2 text-sm text-[#8080a8] hover:text-white mb-4"><ArrowLeft size={13}/>Courses</Link>
        <h1 className="text-3xl font-display font-bold text-white">Add Lesson</h1>
      </div>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/[0.06] space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Course *</label>
          <select value={form.course_id} onChange={e=>set('course_id',e.target.value)} className={`input-field ${errors.course_id?'error':''}`} style={{appearance:'none'}}>
            <option value="">Select a course...</option>
            {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_title}</option>)}
          </select>
          {errors.course_id && <p className="text-xs text-rose-400 mt-1.5">{errors.course_id}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Lesson Title *</label>
          <div className="relative"><BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
            <input type="text" value={form.lesson_title} onChange={e=>set('lesson_title',e.target.value)} placeholder="e.g. Introduction to Variables" className={`input-field pl-10 ${errors.lesson_title?'error':''}`}/>
          </div>
          {errors.lesson_title && <p className="text-xs text-rose-400 mt-1.5">{errors.lesson_title}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Content / Notes</label>
          <textarea value={form.lesson_content} onChange={e=>set('lesson_content',e.target.value)} placeholder="Key concepts, notes, or video description..." rows={4} className="input-field resize-none"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Duration (minutes)</label>
          <div className="relative"><Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
            <input type="number" min="1" value={form.lesson_duration} onChange={e=>set('lesson_duration',e.target.value)} placeholder="e.g. 20" className="input-field pl-10"/>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Link to="/instructor/courses" className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold text-center">Cancel</Link>
          <button type="submit" disabled={loading} className="btn-emerald flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm"/> : <><Save size={14}/>Add Lesson</>}
          </button>
        </div>
      </form>
    </div>
  );
}
