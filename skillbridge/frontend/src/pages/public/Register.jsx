import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const strengthConfig = [
  { label: 'Weak',   color: 'bg-rose-500',   w: '25%',  text: 'text-rose-400' },
  { label: 'Fair',   color: 'bg-amber-500',  w: '50%',  text: 'text-amber-400' },
  { label: 'Good',   color: 'bg-blue-500',   w: '75%',  text: 'text-blue-400' },
  { label: 'Strong', color: 'bg-emerald-500',w: '100%', text: 'text-emerald-400' },
];

function getStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.max(0, s - 1);
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const strength = form.password.length > 0 ? getStrength(form.password) : -1;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '', api: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      setDone(true);
      toast('Account created! Signing you in...', 'success');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : 'Registration failed. Try a different email.';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-up">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6" style={{animation:'bounceIn 0.6s ease'}}>
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">You're in!</h2>
        <p className="text-[#7070a0]">Account created. Taking you to sign in...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(139,92,246,0.1) 0%, transparent 60%), #06061a'
      }}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}/>
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-all">
              <GraduationCap size={21} className="text-[#06061a]" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create your account</h1>
          <p className="text-[#7070a0] text-sm">Join 12,000+ learners. It's completely free.</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.5)] animate-fade-up" style={{animationDelay:'0.1s'}}>
          {errors.api && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 mb-5" style={{animation:'bounceIn 0.4s ease'}}>
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-rose-300 leading-snug">{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Your full name" autoComplete="name"
                  className={`input-field pl-10 ${errors.name ? 'error' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'error' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => set('password', e.target.value)} placeholder="Min. 6 characters" autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'error' : ''}`} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {form.password.length > 0 && strength >= 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#7070a0]">Strength</span>
                    <span className={strengthConfig[strength].text}>{strengthConfig[strength].label}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strengthConfig[strength].color}`} style={{width:strengthConfig[strength].w}} />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold text-[#7070a0] uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7070a0] pointer-events-none" />
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Repeat your password" autoComplete="new-password"
                  className={`input-field pl-10 pr-10 ${errors.confirm ? 'error' : form.confirm && form.confirm === form.password ? 'success' : ''}`} />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {errors.confirm && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.confirm}</p>}
            </div>

            <div className="pt-1">
              <p className="text-xs text-[#5050a0] mb-3">You'll be registered as a <span className="text-amber-400 font-medium">Student</span>. Instructors are set up by admin.</p>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <LoadingSpinner size="sm" /> : <><span>Create Account</span><ArrowRight size={15}/></>}
              </button>
            </div>
          </form>

          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-sm text-[#7070a0]">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
