import { useState, useEffect } from 'react';
import { Search, BookOpen, SlidersHorizontal, X } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import CourseCard from '../../components/CourseCard';
import { PageLoader } from '../../components/LoadingSpinner';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const [enrollingId, setEnrollingId] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/courses/?limit=100');
        setCourses(res.data);
        if (user) {
          const enrRes = await api.get('/enrollments/me');
          setEnrolledIds(new Set(enrRes.data.map(e => e.course_id)));
        }
      } catch (e) {
        console.error('Courses load error:', e);
        toast('Could not load courses. Is the backend running?', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) { toast('Please sign in to enroll in courses', 'warning'); return; }
    setEnrollingId(courseId);
    try {
      await api.post('/enrollments/', { user_id: user.user_id, course_id: courseId });
      setEnrolledIds(prev => new Set([...prev, courseId]));
      toast('Enrolled successfully! Check your dashboard.', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Enrollment failed', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  // FIX: case-insensitive level match, treat null/undefined level as "Beginner"
  const filtered = courses.filter(c => {
    const matchSearch = !search ||
      c.course_title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const courseLevel = (c.level || 'Beginner').toLowerCase();
    const matchLevel = level === 'All' || courseLevel === level.toLowerCase();
    return matchSearch && matchLevel;
  });

  if (loading) return <PageLoader message="Loading courses..." />;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge badge-violet mb-4">Course Catalog</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explore <span className="text-gradient-gold">All Courses</span>
          </h1>
          <p className="text-[#8080a8] max-w-xl mx-auto">
            {courses.length > 0 ? `${courses.length} expert-crafted courses` : 'Courses will appear once the backend is seeded'} across multiple disciplines.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3 animate-fade-up border border-white/[0.06]" style={{animationDelay:'0.1s'}}>
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics, skills..." className="input-field pl-10 py-2.5" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7070a0] hover:text-white">
                <X size={14}/>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal size={14} className="text-[#7070a0]" />
            <div className="flex gap-1.5">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    level === l
                      ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25'
                      : 'btn-ghost'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* No backend data hint */}
        {courses.length === 0 && (
          <div className="glass rounded-2xl p-6 mb-8 border border-amber-400/15 text-center">
            <p className="text-amber-400 text-sm font-medium mb-1">Backend might not be running or database is empty</p>
            <p className="text-[#7070a0] text-xs">Start the backend with <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">uvicorn app.main:app --reload</code> then run <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono">python seed.py</code></p>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 && courses.length > 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="text-[#7070a0] mx-auto mb-4 opacity-40" />
            <h3 className="font-display text-xl text-white mb-2">No courses match your search</h3>
            <button onClick={() => { setSearch(''); setLevel('All'); }} className="text-amber-400 text-sm hover:underline mt-2">Clear filters</button>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-xs text-[#7070a0] mb-6 font-mono">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <div key={course.course_id} className="animate-fade-up" style={{animationDelay:`${Math.min(i,8)*60}ms`,animationFillMode:'both'}}>
                  <CourseCard
                    course={course} index={i}
                    showEnroll
                    enrolled={enrolledIds.has(course.course_id)}
                    enrolling={enrollingId === course.course_id}
                    onEnroll={handleEnroll}
                  />
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
