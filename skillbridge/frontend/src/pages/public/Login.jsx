import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, GraduationCap, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const user = await login(form.email.trim(), form.password);
      toast('Welcome back! 🎉', 'success');
      setTimeout(() => navigate(user.role_id === 2 ? '/instructor' : '/student'), 400);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password. Please try again.';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (field, val) => { setForm(p => ({ ...p, [field]: val })); setErrors(p => ({ ...p, [field]: '' })); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 30%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 80%, rgba(251,191,36,0.08) 0%, transparent 60%), #06061a'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}/>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_44px_rgba(251,191,36,0.5)] transition-all group-hover:scale-110">
              <GraduationCap size={21} className="text-[#06061a]" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
          <p className="text-[#7070a0] text-sm">Sign in to continue your learning journey</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.5)] animate-fade-up" style={{animationDelay:'0.1s'}}>
          {errors.api && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 mb-5" style={{animation:'bounceIn 0.4s ease'}}>
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-rose-300 leading-snug">{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'error' : form.email && !errors.email ? 'success' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11}/>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)} placeholder="••••••••" autoComplete="current-password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'error' : ''}`} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11}/>{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1">
              {loading ? <LoadingSpinner size="sm" /> : <><span>Sign In</span><ArrowRight size={15}/></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-sm text-[#7070a0]">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Create one free</Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 glass rounded-2xl border border-white/[0.05]">
          <p className="text-xs text-[#7070a0] font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"><Sparkles size={11} className="text-amber-400"/>Demo Accounts (after seeding)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { role: 'Student', email: 'student@test.com', pw: 'test123', color: 'text-amber-400' },
              { role: 'Instructor', email: 'prof@test.com', pw: 'test123', color: 'text-emerald-400' },
            ].map(({ role, email, pw, color }) => (
              <button key={role} onClick={() => setForm({ email, password: pw })}
                className="text-left p-2.5 rounded-xl glass-hover border border-white/[0.05] hover:border-white/10 transition-all">
                <div className={`font-semibold ${color} mb-0.5`}>{role}</div>
                <div className="text-[#7070a0] font-mono text-[10px] truncate">{email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
