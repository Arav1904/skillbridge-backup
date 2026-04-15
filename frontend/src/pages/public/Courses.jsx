import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import CourseCard from '../../components/CourseCard';
import { PageLoader } from '../../components/LoadingSpinner';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState({});
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [coursesRes, catsRes] = await Promise.all([
          api.get('/courses/?limit=100'),
          api.get('/categories/?limit=100')
        ]);
        
        setCourses(coursesRes.data);
        
        // Map categories for quick lookup by ID
        const catMap = {};
        catsRes.data.forEach(c => { catMap[c.category_id] = c.category_name; });
        setCategories(catMap);

        if (user) {
          const enrRes = await api.get('/enrollments/me');
          setEnrolledIds(new Set(enrRes.data.map(e => e.course_id)));
        }
      } catch (e) {
        console.error('Failed to fetch courses:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) { toast('Please sign in to enroll', 'warning'); return; }
    try {
      await api.post('/enrollments/', { user_id: user.user_id, course_id: courseId });
      setEnrolledIds(prev => new Set([...prev, courseId]));
      toast('Successfully enrolled! Check your dashboard.', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Enrollment failed', 'error');
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.course_title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'All' || c.level?.toLowerCase() === level.toLowerCase();
    return matchSearch && matchLevel;
  });

  if (loading) return <PageLoader message="Loading courses..." />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge badge-violet mb-4">Course Catalog</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explore <span className="text-gradient-gold">All Courses</span>
          </h1>
          <p className="text-[#9090b8] max-w-xl mx-auto text-base">
            Learn from the best. {courses.length} high-quality courses designed to elevate your career in 2026.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center animate-fade-up delay-100">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, skills, or topics..." className="input-field pl-12" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <SlidersHorizontal size={14} className="text-[#9090b8] hidden sm:block" />
            <div className="flex gap-2 min-w-max">
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${level === l ? 'bg-amber-400 text-[#06061a] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]' : 'btn-ghost border-transparent'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-32 bg-white/05 rounded-3xl border border-dashed border-white/10">
            <BookOpen size={64} className="text-[#9090b8] mx-auto mb-6 opacity-20" />
            <h3 className="font-display text-2xl text-white mb-2">No matching courses</h3>
            <p className="text-[#9090b8] text-base">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 animate-fade-in">
              <p className="text-sm font-medium text-[#9090b8]">
                Found <span className="text-white">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''} for you
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((course, i) => (
                <div key={course.course_id} className="animate-fade-up" style={{animationDelay:`${(i % 6) * 80}ms`}}>
                  <CourseCard
                    course={course} index={i}
                    categoryName={categories[course.category_id]}
                    showEnroll={true}
                    enrolled={enrolledIds.has(course.course_id)}
                    onEnroll={handleEnroll}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
