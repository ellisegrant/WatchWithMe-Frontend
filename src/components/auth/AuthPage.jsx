import { useState } from 'react';
import supabase from '../../config/supabase';

function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
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

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setLoading(false);
    onAuthSuccess({
      id: data.user.id,
      email: data.user.email,
      username: profile.username,
      avatar_url: profile.avatar_url,
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

    // Create auth user
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
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: form.username,
        email: form.email
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess('Account created! You can now log in.');
    setIsLogin(true);
    setForm({ email: form.email, password: '', username: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#0E1726] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#1E5B99]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#1E5B99]/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-[#1E5B99]">Jesley</span>
          </h1>
          <p className="text-[#A1B0C8]">Watch together, anywhere</p>
        </div>

        {/* Card */}
        <div className="bg-[#1A2332] rounded-2xl border border-[#2A3C52] p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex mb-8 bg-[#0E1726] rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                isLogin 
                  ? 'bg-[#1E5B99] text-white shadow-lg' 
                  : 'text-[#A1B0C8] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                !isLogin 
                  ? 'bg-[#1E5B99] text-white shadow-lg' 
                  : 'text-[#A1B0C8] hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Password
                </label>
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
                className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1E5B99]/20 mt-2"
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
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Username
                </label>
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
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Password
                </label>
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
                <label className="block text-sm font-medium text-[#A1B0C8] mb-2">
                  Confirm Password
                </label>
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
                className="w-full py-3 bg-[#1E5B99] hover:bg-[#2672B8] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#1E5B99]/20 mt-2"
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
        </div>
      </div>
    </div>
  );
}

export default AuthPage;