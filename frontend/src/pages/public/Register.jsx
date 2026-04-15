import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const strengthLevels = [
  { label: 'Weak', color: 'bg-rose-500', width: '25%' },
  { label: 'Fair', color: 'bg-amber-500', width: '50%' },
  { label: 'Good', color: 'bg-blue-500', width: '75%' },
  { label: 'Strong', color: 'bg-emerald-500', width: '100%' },
];

function getStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s - 1;
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const strength = form.password.length > 0 ? getStrength(form.password) : -1;

  const validate = () => {
    const e = {};
    const emailTrimmed = form.email.trim();
    
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    
    if (!emailTrimmed) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) e.email = 'Enter a valid email address';
    
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      setSuccess(true);
      toast('Account created! Redirecting to login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. This email might already be in use.';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Account Created!</h2>
          <p className="text-[#9090b8]">Welcome to SkillBridge 2026. Taking you to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-amber-500/10 -top-20 -right-20 blur-3xl" />
        <div className="orb w-96 h-96 bg-violet-600/10 -bottom-20 -left-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <GraduationCap size={20} className="text-[#06061a]" />
            </div>
            <span className="font-display font-bold text-xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
          <p className="text-[#9090b8] text-sm md:text-base">Join the future of learning in 2026.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/[0.08] shadow-2xl">
          {errors.api && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6 animate-shake">
              <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
              <span className="text-sm text-rose-300 font-medium">{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mb-2 px-1">Full Name</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input type="text" value={form.name}
                  onChange={e => { setForm(p => ({...p, name: e.target.value})); setErrors(p => ({...p, name: ''})); }}
                  placeholder="John Doe" className={`input-field pl-12 ${errors.name ? 'border-rose-500/50 bg-rose-500/5' : ''}`} />
              </div>
              {errors.name && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mb-2 px-1">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input type="email" value={form.email}
                  onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email: ''})); }}
                  placeholder="name@email.com" className={`input-field pl-12 ${errors.email ? 'border-rose-500/50 bg-rose-500/5' : ''}`} />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mb-2 px-1">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password: ''})); }}
                  placeholder="••••••••" className={`input-field pl-12 pr-12 ${errors.password ? 'border-rose-500/50 bg-rose-500/5' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9090b8] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && strength >= 0 && (
                <div className="mt-3 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#9090b8] uppercase">Security Strength</span>
                    <span className={`text-[10px] font-bold uppercase ${['text-rose-400','text-amber-400','text-blue-400','text-emerald-400'][strength]}`}>
                      {strengthLevels[strength].label}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strengthLevels[strength].color}`}
                      style={{width: strengthLevels[strength].width}} />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mb-2 px-1">Confirm Identity</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input type="password" value={form.confirm}
                  onChange={e => { setForm(p => ({...p, confirm: e.target.value})); setErrors(p => ({...p, confirm: ''})); }}
                  placeholder="Repeat password" className="input-field pl-12" />
              </div>
              {errors.confirm && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-4 rounded-2xl font-bold text-sm mt-4 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/10 disabled:opacity-50">
              {loading ? <LoadingSpinner size="sm" /> : <>
                <span>Create My Account</span>
                <ArrowRight size={18} />
              </>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-[#9090b8]">
              Ready to learn?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
