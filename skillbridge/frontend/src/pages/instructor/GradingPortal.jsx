import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Save, AlertCircle, Search, ClipboardCheck, Trophy } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function GradingPortal() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/submissions/')
      .then(r => {
        const data = r.data || [];
        setSubmissions(data);
        const init = {};
        data.forEach(s => { init[`${s.assignment_id}-${s.user_id}`] = s.marks != null ? String(s.marks) : ''; });
        setInputs(init);
      })
      .catch(() => toast('Failed to load submissions', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleGrade = async (assignmentId, userId) => {
    const key = `${assignmentId}-${userId}`;
    const marks = parseInt(inputs[key]);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      toast('Enter a valid grade between 0 and 100', 'warning'); return;
    }
    setSaving(p => ({ ...p, [key]: true }));
    try {
      await api.put(`/submissions/${assignmentId}/${userId}`, { marks });
      setSubmissions(prev => prev.map(s =>
        s.assignment_id === assignmentId && s.user_id === userId ? { ...s, marks } : s
      ));
      toast(`✓ Grade ${marks}/100 saved for User #${userId}`, 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Grading failed', 'error');
    } finally {
      setSaving(p => ({ ...p, [key]: false }));
    }
  };

  if (loading) return <PageLoader message="Loading submissions..." />;

  const ungraded = submissions.filter(s => s.marks == null).length;
  const graded = submissions.filter(s => s.marks != null).length;
  const avg = graded > 0 ? Math.round(submissions.filter(s=>s.marks!=null).reduce((a,s)=>a+s.marks,0)/graded) : null;

  const filtered = submissions.filter(s => {
    const matchF = filter === 'all' || (filter === 'ungraded' && s.marks == null) || (filter === 'graded' && s.marks != null);
    const matchS = !search || String(s.assignment_id).includes(search) || String(s.user_id).includes(search);
    return matchF && matchS;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Grading Portal</h1>
        <p className="text-[#8080a8] text-sm mt-1">Review and grade student submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: submissions.length, color: 'badge-blue' },
          { label: 'Ungraded', val: ungraded, color: 'badge-gold' },
          { label: 'Graded', val: graded, color: 'badge-emerald' },
          { label: 'Avg Score', val: avg != null ? `${avg}%` : '—', color: 'badge-violet' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center border border-white/[0.05]">
            <div className="text-2xl font-display font-bold text-white">{val}</div>
            <span className={`badge ${color} mt-1.5`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 flex flex-col sm:flex-row gap-3 border border-white/[0.05]">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7070a0]"/>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by assignment or user ID..." className="input-field pl-8 py-2 text-sm"/>
        </div>
        <div className="flex gap-2">
          {['all','ungraded','graded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/25' : 'btn-ghost'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <ClipboardCheck size={56} className="text-emerald-400/25 mx-auto mb-6 animate-float"/>
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            {submissions.length === 0 ? 'No submissions yet' : 'No results'}
          </h2>
          <p className="text-[#8080a8]">{submissions.length === 0 ? 'Students will appear here once they submit.' : 'Try different filters.'}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
          {/* Header */}
          <div className="hidden md:grid px-5 py-3 text-xs font-semibold text-[#7070a0] uppercase tracking-wider"
            style={{gridTemplateColumns:'1fr 1fr 1.5fr 80px 160px 90px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.02)'}}>
            <span>Assignment</span><span>Student</span><span>Submitted</span>
            <span className="text-center">Score</span><span className="text-center">New Grade</span><span className="text-center">Save</span>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {filtered.map((sub, i) => {
              const key = `${sub.assignment_id}-${sub.user_id}`;
              const inputVal = inputs[key] ?? '';
              const currentVal = sub.marks != null ? String(sub.marks) : '';
              const changed = inputVal !== currentVal && inputVal !== '';
              return (
                <div key={key} className="p-4 md:p-0 flex flex-col md:grid gap-3 md:gap-0 hover:bg-white/[0.02] transition-colors animate-fade-up"
                  style={{gridTemplateColumns:'1fr 1fr 1.5fr 80px 160px 90px',animationDelay:`${Math.min(i,12)*20}ms`,animationFillMode:'both'}}>
                  {/* Assignment */}
                  <div className="flex items-center md:px-5 md:py-4">
                    <span className="badge badge-violet">Asgn #{sub.assignment_id}</span>
                  </div>
                  {/* Student */}
                  <div className="flex items-center gap-2 md:px-5 md:py-4">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{sub.user_id}</div>
                    <span className="text-sm text-white">User #{sub.user_id}</span>
                  </div>
                  {/* Date */}
                  <div className="flex items-center md:px-5 md:py-4">
                    {sub.submission_date
                      ? <span className="text-xs text-[#7070a0] flex items-center gap-1"><Clock size={10}/>{new Date(sub.submission_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                      : <span className="text-xs text-[#5050a0]">—</span>}
                  </div>
                  {/* Current score */}
                  <div className="flex items-center justify-start md:justify-center md:px-2 md:py-4">
                    {sub.marks != null
                      ? <span className={`badge ${sub.marks>=80?'badge-emerald':sub.marks>=50?'badge-gold':'badge-rose'}`}>{sub.marks}</span>
                      : <span className="text-xs text-[#5050a0]">—</span>}
                  </div>
                  {/* Input */}
                  <div className="flex items-center md:justify-center md:px-3 md:py-4">
                    <input type="number" min="0" max="100" value={inputVal}
                      onChange={e => setInputs(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="0–100"
                      className={`w-full md:w-20 px-3 py-2 rounded-xl text-sm text-center font-mono outline-none border transition-all ${
                        changed ? 'border-amber-400/40 bg-amber-400/5 text-amber-300' : 'input-field'}`}/>
                  </div>
                  {/* Save */}
                  <div className="flex items-center md:justify-center md:px-3 md:py-4">
                    <button onClick={() => handleGrade(sub.assignment_id, sub.user_id)}
                      disabled={saving[key] || !changed}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        changed ? 'btn-emerald' : 'btn-ghost'}`}>
                      {saving[key] ? <LoadingSpinner size="sm"/> : <><Save size={12}/>Save</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
