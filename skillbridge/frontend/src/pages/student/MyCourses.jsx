import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Clock, ArrowRight, PlusCircle, CheckCircle, Trash2 } from 'lucide-react';
import api from '../../api';
import { PageLoader } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';

export default function MyCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await api.delete(`/enrollments/${user.user_id}/${courseId}`);
      setEnrollments(prev => prev.filter(e => e.course_id !== courseId));
      toast('Unenrolled successfully', 'success');
    } catch (e) {
      console.error(e);
      toast('Failed to unenroll', 'error');
    }
  };

  useEffect(() => {
    Promise.all([api.get('/enrollments/me'), api.get('/courses/?limit=100')])
      .then(([enrRes, cRes]) => {
        setEnrollments(enrRes.data);
        const m = {};
        cRes.data.forEach(c => { m[c.course_id] = c; });
        setCourses(m);
      })
      .catch(() => toast('Failed to load courses', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader message="Loading your courses..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Courses</h1>
          <p className="text-[#8080a8] text-sm mt-1">{enrollments.length} enrolled</p>
        </div>
        <Link to="/courses" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <PlusCircle size={14}/> Browse More
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <BookOpen size={56} className="text-amber-400/30 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No courses yet</h2>
          <p className="text-[#8080a8] mb-8 max-w-sm mx-auto">Start your learning journey by exploring our catalog</p>
          <Link to="/courses" className="btn-gold px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
            Explore Courses <ArrowRight size={15}/>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {enrollments.map((enr, i) => {
            const course = courses[enr.course_id];
            const prog = enr.progress || 0;
            const isComplete = prog === 100;
            return (
              <div key={enr.course_id} className="card p-5 animate-fade-up" style={{animationDelay:`${i*60}ms`,animationFillMode:'both'}}>
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{background:`linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(79,70,229,0.4) 100%)`,border:'1px solid rgba(99,102,241,0.3)'}}>
                    {isComplete
                      ? <CheckCircle size={22} className="text-emerald-400"/>
                      : <BookOpen size={22} className="text-indigo-300"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white text-base leading-snug line-clamp-1 mb-1">
                      {course?.course_title || `Course #${enr.course_id}`}
                    </h3>
                    <p className="text-xs text-[#8080a8] line-clamp-1 mb-3">
                      {course?.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="progress-track flex-1 h-2">
                        <div className="progress-fill" style={{width:`${prog}%`,height:'100%'}}/>
                      </div>
                      <span className="text-xs font-semibold text-amber-400 w-9 text-right">{prog}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className={`badge ${isComplete ? 'badge-emerald' : prog > 0 ? 'badge-gold' : 'badge-blue'}`}>
                        {isComplete ? 'Completed' : prog > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                      {course?.duration && (
                        <span className="text-xs text-[#7070a0] flex items-center gap-1"><Clock size={10}/>{course.duration}h</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex gap-2">
                  <Link to={`/student/course/${enr.course_id}`}
                    className="btn-gold flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                    <PlayCircle size={14}/>
                    {prog > 0 ? 'Continue Learning' : 'Start Course'}
                  </Link>
                  <button onClick={() => handleUnenroll(enr.course_id)}
                    className="px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                    title="Unenroll">
                    <Trash2 size={14}/> Unenroll
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
