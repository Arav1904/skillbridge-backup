import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'radial-gradient(ellipse 70% 60% at 30% 30%,rgba(99,102,241,0.12) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 70% 80%,rgba(251,191,36,0.08) 0%,transparent 60%),#06061a'}}/>
      <div className="text-center relative z-10 animate-fade-up">
        <div className="text-[9rem] md:text-[12rem] font-display font-bold text-gradient-gold leading-none mb-2 select-none">404</div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Page not found</h1>
        <p className="text-[#8080a8] mb-8 max-w-sm mx-auto">This page doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ArrowLeft size={14}/> Go Back
          </button>
          <Link to="/" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Home size={14}/> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
