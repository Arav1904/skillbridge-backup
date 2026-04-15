import { Clock, Users, Star, BookOpen, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const levelStyles = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const gradientPresets = [
  'from-violet-600/20 to-blue-600/20',
  'from-emerald-600/20 to-teal-600/20',
  'from-amber-600/20 to-orange-600/20',
  'from-rose-600/20 to-pink-600/20',
];

export default function CourseCard({ course, index = 0, showEnroll, onEnroll, enrolled, categoryName }) {
  const level = (course.level || 'Beginner').toLowerCase();
  const preset = gradientPresets[index % gradientPresets.length];

  return (
    <div className="card group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col h-full hover:border-amber-400/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Visual Header */}
      <div className={`h-40 relative flex items-center justify-center bg-gradient-to-br ${preset}`}>
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, white 0%, transparent 60%)',
          backgroundSize: '200% 200%',
        }} />
        
        <BookOpen size={48} className="text-white/10 group-hover:text-white/30 group-hover:scale-110 transition-all duration-700 blur-[2px] group-hover:blur-0" />
        
        {/* Badges on Top */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${levelStyles[level] || levelStyles.beginner}`}>
            {course.level || 'Beginner'}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass text-[10px] font-bold text-amber-300 border border-amber-400/20 shadow-lg">
            <Star size={10} fill="currentColor" /> {(4.5 + (index % 5) * 0.1).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Category Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            {categoryName || 'General Skill'}
          </span>
        </div>

        <h3 className="text-lg font-display font-bold text-white mb-2 leading-tight group-hover:text-amber-300 transition-colors line-clamp-2">
          {course.course_title}
        </h3>
        
        <p className="text-sm text-[#9090b8] leading-relaxed mb-6 flex-1 line-clamp-2">
          {course.description || 'Elevate your professional skills with this expert-led course in 2026.'}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/[0.05] mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-[#9090b8] uppercase font-semibold">Time</span>
            <div className="flex items-center gap-1.5 text-xs text-white">
              <Clock size={12} className="text-amber-400/60" />
              <span>{course.duration || 20}h</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 border-x border-white/[0.05] px-2">
            <span className="text-[10px] text-[#9090b8] uppercase font-semibold">Trust</span>
            <div className="flex items-center gap-1.5 text-xs text-white">
              <Users size={12} className="text-emerald-400/60" />
              <span>{index * 12 + 120}+</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <span className="text-[10px] text-[#9090b8] uppercase font-semibold">Perk</span>
            <div className="flex items-center gap-1.5 text-xs text-white">
              <Award size={12} className="text-violet-400/60" />
              <span>Cert</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {showEnroll && (
          enrolled
            ? <div className="btn-ghost w-full py-3 rounded-xl flex items-center justify-center gap-2 text-emerald-400 border-emerald-400/20 bg-emerald-400/5 cursor-default">
                <TrendingUp size={16} /> <span className="text-sm font-bold uppercase tracking-tight">Active Learning</span>
              </div>
            : <button onClick={() => onEnroll(course.course_id)}
                className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 group/btn">
                <span className="text-sm font-bold uppercase tracking-tight">Access Course</span>
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
        )}
      </div>
    </div>
  );
}
