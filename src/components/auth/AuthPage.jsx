import { useState } from 'react';
import supabase from '../../config/supabase';

function AuthPage({ onAuthSuccess, onSkip }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setLoading(false);
    onAuthSuccess({
      id: data.user.id,
      email: data.user.email,
      username: profile?.username || data.user.email.split('@')[0],
      avatar_url: profile?.avatar_url,
      token: data.session.access_token
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    // Check username availability
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username)
      .single();

    if (existingUser) {
      setError('Username already taken');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Create profile
    await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: form.username,
        email: form.email
      });

    setLoading(false);
    setSuccess('Account created! You can now log in.');
    setIsLogin(true);
    setForm({ email: form.email, password: '', username: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#0E1726] flex items-center justify-center p-4">
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#1E5B99]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#1E5B99]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-[#1E5B99]">Jesley</span>
          </h1>
          <p className="text-[#A1B0C8] text-sm">Watch together, anywhere</p>
        </div>

        {/* Card */}
        <div className="bg-[#1A2332] rounded-2xl border border-[#2A3C52] p-8 shadow-2xl">

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold transition-all mb-4 disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#2A3C52]"></div>
            <span className="text-[#5A6A7F] text-sm">or</span>
            <div className="flex-1 h-px bg-[#2A3C52]"></div>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-[#0E1726] rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                isLogin
                  ? 'bg-[#1E5B99] text-white'
                  : 'text-[#A1B0C8] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                !isLogin
                  ? 'bg-[#1E5B99] text-white'
                  : 'text-[#A1B0C8] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full px-4 py-3 bg-[#0E1726] border border-[#2A3C52] rounded-lg text-white placeholder-[#5A6A7F] focus:outline-none focus:border-[#1E5B99] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          )}

          {/* Skip / Continue as Guest */}
          <div className="mt-6 text-center">
            <button
              onClick={onSkip}
              className="text-[#5A6A7F] hover:text-[#A1B0C8] text-sm transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;