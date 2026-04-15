import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

export default function StudentsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/submissions/').then(r=>setSubmissions(r.data||[])).catch(()=>toast('Failed','error')).finally(()=>setLoading(false));
  }, []);

  const studentMap = {};
  submissions.forEach(s => {
    if (!studentMap[s.user_id]) studentMap[s.user_id] = { user_id: s.user_id, subs: [], graded: 0, total: 0 };
    studentMap[s.user_id].subs.push(s);
    if (s.marks != null) { studentMap[s.user_id].graded++; studentMap[s.user_id].total += s.marks; }
  });
  const students = Object.values(studentMap).filter(s => !search || String(s.user_id).includes(search));

  if (loading) return <PageLoader message="Loading students..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Students</h1>
        <p className="text-[#8080a8] text-sm mt-1">{students.length} student{students.length!==1?'s':''} with submissions</p>
      </div>
      <div className="glass rounded-xl p-3 flex items-center gap-3 border border-white/[0.05]">
        <Search size={13} className="text-[#7070a0]"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by student ID..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#5050a0]"/>
      </div>
      {students.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <Users size={56} className="text-emerald-400/25 mx-auto mb-6 animate-float"/>
          <h2 className="text-2xl font-display font-bold text-white mb-3">No students yet</h2>
          <p className="text-[#8080a8]">Students appear here once they submit assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s, i) => {
            const avg = s.graded > 0 ? Math.round(s.total / s.graded) : null;
            return (
              <div key={s.user_id} className="card p-5 animate-fade-up" style={{animationDelay:`${i*40}ms`,animationFillMode:'both'}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">{s.user_id}</div>
                  <div>
                    <div className="font-semibold text-white">Student #{s.user_id}</div>
                    <div className="text-xs text-[#7070a0]">{s.subs.length} submission{s.subs.length!==1?'s':''}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05] text-center">
                  <div><div className="text-lg font-display font-bold text-white">{s.subs.length}</div><div className="text-[10px] text-[#7070a0]">Submitted</div></div>
                  <div><div className="text-lg font-display font-bold text-emerald-400">{s.graded}</div><div className="text-[10px] text-[#7070a0]">Graded</div></div>
                  <div>
                    <div className={`text-lg font-display font-bold ${avg!=null?(avg>=70?'text-emerald-400':avg>=50?'text-amber-400':'text-rose-400'):'text-[#7070a0]'}`}>{avg??'—'}</div>
                    <div className="text-[10px] text-[#7070a0]">Avg</div>
                  </div>
                </div>
                {avg != null && (
                  <div className="mt-3 progress-track h-1.5">
                    <div className="progress-fill" style={{width:`${avg}%`,height:'100%',background:avg>=70?'linear-gradient(90deg,#10b981,#34d399)':avg>=50?'linear-gradient(90deg,#f59e0b,#fbbf24)':'linear-gradient(90deg,#e11d48,#f43f5e)'}}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
