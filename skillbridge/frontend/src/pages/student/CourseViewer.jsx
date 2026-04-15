import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Clock, CheckCircle, BookOpen, ChevronRight, Lock } from 'lucide-react';
import api from '../../api';
import { PageLoader } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';

export default function CourseViewer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [active, setActive] = useState(null);
  const [done, setDone] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get('/lessons/?limit=100'),
        ]);
        setCourse(courseRes.data);
        // Filter lessons for this course
        const filtered = (lessonsRes.data || []).filter(l => l.course_id === parseInt(courseId));
        setLessons(filtered);
        if (filtered.length > 0) setActive(filtered[0]);
      } catch (e) {
        console.error(e);
        toast('Failed to load course content', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const markDone = (id) => {
    setDone(prev => new Set([...prev, id]));
    toast('Lesson completed! ✓', 'success');
    // Auto-advance to next lesson
    const idx = lessons.findIndex(l => l.lesson_id === id);
    if (idx < lessons.length - 1) setActive(lessons[idx + 1]);
  };

  if (loading) return <PageLoader message="Loading course content..." />;

  const progress = lessons.length > 0 ? Math.round((done.size / lessons.length) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back + header */}
      <Link to="/student/courses" className="inline-flex items-center gap-2 text-sm text-[#8080a8] hover:text-white transition-colors">
        <ArrowLeft size={14}/> My Courses
      </Link>

      <div className="glass rounded-2xl p-5 border border-white/[0.06] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`badge ${(course?.level || 'beginner').toLowerCase() === 'advanced' ? 'badge-rose' : (course?.level || 'beginner').toLowerCase() === 'intermediate' ? 'badge-gold' : 'badge-emerald'}`}>
              {course?.level || 'Beginner'}
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">{course?.course_title || 'Course'}</h1>
          {course?.description && <p className="text-sm text-[#8080a8] mt-1">{course.description}</p>}
        </div>
        <div className="flex-shrink-0 text-center glass rounded-2xl px-6 py-3 border border-white/[0.06]">
          <div className="text-3xl font-display font-bold text-amber-400">{progress}%</div>
          <div className="text-xs text-[#7070a0] mt-0.5">Complete</div>
          <div className="progress-track w-24 h-1.5 mt-2 mx-auto">
            <div className="progress-fill" style={{width:`${progress}%`,height:'100%'}}/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Video/content area */}
        <div className="lg:col-span-2 space-y-4">
          {active ? (
            <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
              {/* Video placeholder */}
              <div className="relative aspect-video flex items-center justify-center cursor-pointer group"
                style={{background:`linear-gradient(135deg, #0d0d2e 0%, #06061a 100%)`}}
                onClick={() => !done.has(active.lesson_id) && markDone(active.lesson_id)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-full border-2 border-amber-400/40 bg-amber-400/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:border-amber-400/60 transition-all duration-300">
                    <PlayCircle size={34} className="text-amber-400 ml-0.5" />
                  </div>
                </div>
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
                  backgroundSize:'40px 40px'
                }}/>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-white/40 text-xs">Click to simulate playback & mark complete</span>
                  {done.has(active.lesson_id) && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-emerald text-emerald-400 text-xs font-semibold">
                      <CheckCircle size={11}/> Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h2 className="font-display font-semibold text-white text-xl mb-2">{active.lesson_title}</h2>
                {active.lesson_duration && (
                  <p className="text-sm text-[#8080a8] flex items-center gap-1.5 mb-3">
                    <Clock size={13} className="text-amber-400/70"/> {active.lesson_duration} minutes
                  </p>
                )}
                {active.lesson_content && (
                  <p className="text-sm text-[#8080a8] leading-relaxed">{active.lesson_content}</p>
                )}
                {!done.has(active.lesson_id) && (
                  <button onClick={() => markDone(active.lesson_id)}
                    className="mt-4 btn-emerald px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                    <CheckCircle size={14}/> Mark as Complete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center border border-white/[0.05]">
              <BookOpen size={48} className="text-[#7070a0] mx-auto mb-4 opacity-40"/>
              <p className="text-[#8080a8]">No lessons available for this course yet.</p>
            </div>
          )}
        </div>

        {/* Lesson list */}
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-white text-sm">Curriculum</h3>
              <p className="text-xs text-[#7070a0] mt-0.5">{lessons.length} lessons · {done.size} done</p>
            </div>
          </div>
          <div className="overflow-y-auto flex-1" style={{maxHeight:'460px'}}>
            {lessons.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#7070a0]">No lessons yet</div>
            ) : lessons.map((lesson, i) => {
              const isActive = active?.lesson_id === lesson.lesson_id;
              const isDone = done.has(lesson.lesson_id);
              return (
                <button key={lesson.lesson_id} onClick={() => setActive(lesson)}
                  className={`w-full text-left flex items-center gap-3 p-4 transition-all border-b border-white/[0.03] ${
                    isActive ? 'bg-amber-400/8' : 'hover:bg-white/[0.03]'
                  }`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                    isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isActive ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                    : 'bg-white/5 text-[#7070a0] border border-white/10'}`}>
                    {isDone ? <CheckCircle size={13}/> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-amber-300' : 'text-white/80'}`}>
                      {lesson.lesson_title}
                    </p>
                    {lesson.lesson_duration && (
                      <p className="text-xs text-[#7070a0] mt-0.5 flex items-center gap-1">
                        <Clock size={9}/>{lesson.lesson_duration}m
                      </p>
                    )}
                  </div>
                  {isActive && <PlayCircle size={13} className="text-amber-400 flex-shrink-0"/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
