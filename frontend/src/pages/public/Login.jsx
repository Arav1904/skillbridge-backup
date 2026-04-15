import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
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
    const emailTrimmed = form.email.trim();
    if (!emailTrimmed) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email.trim(), form.password);
      toast('Welcome back! Redirecting...', 'success');
      setTimeout(() => navigate(user.role_id === 2 ? '/instructor' : '/student'), 500);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600/10 -top-20 -left-20 blur-3xl" />
        <div className="orb w-96 h-96 bg-amber-500/10 -bottom-20 -right-20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <GraduationCap size={22} className="text-[#06061a]" />
            </div>
            <span className="font-display font-bold text-2xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[#9090b8] text-sm md:text-base">Experience the standard of learning in 2026.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-[32px] p-8 md:p-10 border border-white/[0.08] shadow-2xl">
          {errors.api && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6 animate-shake">
              <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
              <span className="text-sm text-rose-300 font-medium">{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-[#9090b8] uppercase tracking-widest mb-2 px-1">Email Terminal</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email: ''})); }}
                  placeholder="name@email.com"
                  className={`input-field pl-12 ${errors.email ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-[#9090b8] uppercase tracking-widest px-1">Access Pass</label>
                <Link to="#" className="text-[10px] font-bold text-amber-400/60 hover:text-amber-400 uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9090b8] group-focus-within:text-amber-400 transition-colors" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password: ''})); }}
                  placeholder="••••••••"
                  className={`input-field pl-12 pr-12 ${errors.password ? 'border-rose-500/50 bg-rose-500/5' : ''}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9090b8] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-400 mt-2 px-1 uppercase tracking-tighter">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-2xl font-bold text-sm mt-4 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" /> : <>
                <span>Verify & Sign In</span>
                <ArrowRight size={18} />
              </>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-[#9090b8]">
              New to SkillBridge?{' '}
              <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
