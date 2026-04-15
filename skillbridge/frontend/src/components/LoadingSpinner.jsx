export default function LoadingSpinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-12 h-12' }[size] || 'w-7 h-7';
  return (
    <div className={`${s} relative flex-shrink-0`}>
      <div className={`${s} rounded-full border-2 border-white/10 border-t-amber-400 animate-spin`}/>
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full border-2 border-white/8 border-t-amber-400 animate-spin"/>
        <div className="absolute inset-2 rounded-full border border-amber-400/20 border-b-amber-400/50 animate-spin" style={{animationDirection:'reverse',animationDuration:'0.7s'}}/>
      </div>
      <p className="text-sm text-[#7070a0] animate-pulse">{message}</p>
    </div>
  );
}
