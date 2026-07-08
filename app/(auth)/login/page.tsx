'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { UserRole } from '@/lib/types';
import { api, setAuthToken } from '@/lib/api-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // role state is now only used for UI toggle, 
  // actual role comes from backend on login
  const [role, setRole] = useState<UserRole>('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await api.login({ email, password });
        setAuthToken(response.access_token);
        // Navigate based on actual user role
        const userRole = response.user?.role || role; 
        window.location.href = `/${userRole}/dashboard`;
      } else {
        // Register flow
        const response = await api.signup({ 
          email, 
          password, 
          name, 
          role 
        });
        setAuthToken(response.access_token);
        window.location.href = `/${role}/dashboard`;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-xl shadow-primary/20 border-2 border-primary-high/20">
            <svg className="w-8 h-8 text-on-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <h1 className="text-4xl font-heading font-extrabold text-foreground tracking-tight">
            SkinCare<span className="text-primary truncate">AI</span>
          </h1>
          <p className="mt-3 text-sm text-foreground/40 font-medium tracking-wide uppercase">
            Clinical Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-[2rem] p-10 shadow-2xl border border-foreground/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
          
          {/* Role Selection */}
          <div className="mb-10 text-center">
             <p className="text-xs font-bold text-foreground/30 mb-4 uppercase tracking-[0.2em]">Select Portal</p>
              <div className="flex p-1.5 bg-surface-highest/50 rounded-2xl border border-foreground/5">
                <button
                  onClick={() => setRole('patient')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-500 uppercase tracking-widest ${
                    role === 'patient'
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-foreground/40 hover:text-foreground/70'
                  }`}
                >
                  Patient
                </button>
                <button
                  onClick={() => setRole('doctor')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-500 uppercase tracking-widest ${
                    role === 'doctor'
                      ? 'bg-secondary text-on-secondary shadow-lg shadow-secondary/20 scale-[1.02]'
                      : 'text-foreground/40 hover:text-foreground/70'
                  }`}
                >
                  Specialist
                </button>
              </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <Input
                type="text"
                label="Full Name"
                placeholder="Dr. John Doe / Patient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              type="email"
              label="Professional Email"
              placeholder="name@clinical.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Access Secret"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full h-14 !rounded-2xl text-lg tracking-wide bg-primary shadow-lg shadow-primary/30"
            >
              {isLogin ? 'Authenticate' : 'Register Account'}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="mt-10 text-center border-t border-foreground/5 pt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group text-sm font-semibold text-foreground/40 hover:text-primary transition-colors duration-300"
            >
              {isLogin
                ? <span>New to the platform? <span className="text-primary/70 group-hover:text-primary transition-colors underline underline-offset-4 font-bold">Initialize Access</span></span>
                : <span>Already registered? <span className="text-primary/70 group-hover:text-primary transition-colors underline underline-offset-4 font-bold">Sign In</span></span>}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex flex-col items-center gap-4 opacity-30">
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5 grayscale opacity-50">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold tracking-tighter uppercase whitespace-nowrap">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-50">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-[10px] font-bold tracking-tighter uppercase whitespace-nowrap">HIPAA Compliant</span>
            </div>
          </div>
          <p className="text-[10px] font-medium tracking-tighter uppercase">
            © 2026 SkinCare AI Intelligence. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}