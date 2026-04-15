import { Clock, Users, Star, BookOpen, CheckCircle, Loader } from 'lucide-react';

const levelColors = { beginner: 'badge-emerald', intermediate: 'badge-gold', advanced: 'badge-rose' };
const gradients = [
  ['#1e1b4b','#312e81','#818cf8'], ['#052e16','#14532d','#34d399'],
  ['#431407','#7c2d12','#fb923c'], ['#2e1065','#4c1d95','#a78bfa'],
  ['#0c4a6e','#075985','#38bdf8'], ['#3b0764','#581c87','#c084fc'],
];

export default function CourseCard({ course, index = 0, showEnroll, onEnroll, enrolled, enrolling }) {
  const level = (course.level || 'Beginner').toLowerCase();
  const [dark, mid, accent] = gradients[index % gradients.length];
  const stars = (4.1 + (index * 0.15) % 0.9).toFixed(1);
  const students = 89 + index * 43;

  return (
    <div className="card group flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="relative h-36 flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{background:`linear-gradient(135deg, ${dark} 0%, ${mid} 100%)`}}>
        <div className="absolute inset-0" style={{
          backgroundImage:`radial-gradient(circle at 25% 50%, ${accent}44 0%, transparent 65%),
            radial-gradient(circle at 80% 20%, ${accent}22 0%, transparent 50%)`
        }}/>
        {/* Decorative circles */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{background:accent}}/>
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full opacity-10" style={{background:accent}}/>
        <BookOpen size={38} className="relative z-10 text-white/25 group-hover:text-white/45 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500" />
        {/* Level badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${levelColors[level] || 'badge-blue'}`}>{course.level || 'Beginner'}</span>
        </div>
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-white/80 font-medium"
          style={{background:'rgba(0,0,0,0.3)',backdropFilter:'blur(8px)'}}>
          <Star size={10} fill="currentColor" className="text-amber-400" /> {stars}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-white text-[0.95rem] leading-snug mb-2 group-hover:text-amber-300 transition-colors duration-200 line-clamp-2">
          {course.course_title}
        </h3>
        <p className="text-xs text-[#8080a8] leading-relaxed mb-4 flex-1 line-clamp-2">
          {course.description || 'Build real-world skills with this expert-crafted course.'}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-[#7070a0] mb-4 pt-3 border-t border-white/[0.05]">
          {course.duration && (
            <span className="flex items-center gap-1"><Clock size={11} className="text-amber-400/70"/>{course.duration}h</span>
          )}
          <span className="flex items-center gap-1"><Users size={11} className="text-emerald-400/70"/>{students}</span>
          <span className="ml-auto badge badge-blue text-[9px]">Certificate</span>
        </div>

        {/* Enroll button */}
        {showEnroll && (
          enrolled
            ? <div className="flex items-center gap-2 py-2 text-sm text-emerald-400 font-semibold">
                <CheckCircle size={15}/> Enrolled
              </div>
            : <button
                onClick={() => onEnroll(course.course_id)}
                disabled={enrolling}
                className="btn-gold w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                {enrolling
                  ? <><Loader size={14} className="animate-spin"/> Enrolling...</>
                  : 'Enroll Now'}
              </button>
        )}
      </div>
    </div>
  );
}
