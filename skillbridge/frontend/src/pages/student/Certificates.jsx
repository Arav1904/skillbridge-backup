import { useEffect, useState } from 'react';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([api.get('/certificates/me'), api.get('/courses/?limit=100')])
      .then(([certRes, cRes]) => {
        setCerts(certRes.data || []);
        const m = {}; cRes.data.forEach(c => { m[c.course_id] = c; }); setCourses(m);
      })
      .catch(() => toast('Failed to load certificates', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = { A: 'text-emerald-400', B: 'text-blue-400', C: 'text-amber-400', D: 'text-orange-400', F: 'text-rose-400' };

  if (loading) return <PageLoader message="Loading certificates..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">My Certificates</h1>
        <p className="text-[#8080a8] text-sm mt-1">{certs.length} earned</p>
      </div>

      {certs.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <Award size={64} className="text-amber-400/25 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No certificates yet</h2>
          <p className="text-[#8080a8] max-w-md mx-auto">Complete a course and get graded to earn your certificate. They'll appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, i) => {
            const course = courses[cert.course_id];
            return (
              <div key={`${cert.user_id}-${cert.course_id}`}
                className="relative overflow-hidden rounded-2xl border border-amber-400/15 animate-fade-up"
                style={{animationDelay:`${i*80}ms`,animationFillMode:'both',background:'linear-gradient(135deg,rgba(251,191,36,0.06) 0%,rgba(6,6,26,0.95) 100%)'}}>
                {/* Decorative bg */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/5"/>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-amber-400/5"/>
                </div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] flex-shrink-0">
                        <Award size={22} className="text-[#06061a]"/>
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Certificate of Completion</p>
                        <h3 className="font-display font-bold text-white text-base mt-0.5">
                          {course?.course_title || `Course #${cert.course_id}`}
                        </h3>
                      </div>
                    </div>
                    {cert.grade && (
                      <div className="flex-shrink-0 text-center">
                        <div className={`text-3xl font-display font-bold ${gradeColor[cert.grade] || 'text-amber-400'}`}>{cert.grade}</div>
                        <div className="text-[10px] text-[#7070a0]">Grade</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-amber-400/10">
                    <div>
                      <p className="text-xs text-[#7070a0]">Awarded to</p>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                    </div>
                    {cert.issue_date && (
                      <div className="text-right">
                        <p className="text-xs text-[#7070a0]">Issued</p>
                        <p className="text-sm text-amber-400 font-medium">{new Date(cert.issue_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-3 flex gap-2 border-t border-amber-400/10" style={{background:'rgba(0,0,0,0.2)'}}>
                  <button onClick={() => toast('Download ready! (demo)', 'success')}
                    className="btn-ghost flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Download size={12}/> Download PDF
                  </button>
                  <button onClick={() => toast('Copied shareable link!', 'success')}
                    className="btn-ghost flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Share2 size={12}/> Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
