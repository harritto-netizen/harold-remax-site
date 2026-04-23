import { useState, FormEvent } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { signIn } from '../lib/auth';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="bg-cream/5 border border-cream/20 p-8 md:p-12 max-w-md w-full">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-8 h-8 text-cream mr-3" />
          <h1 className="font-montserrat text-2xl sm:text-3xl font-light uppercase tracking-wider text-cream">
            Admin Login
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 flex items-start space-x-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="font-lato text-cream text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato"
              disabled={loading}
            />
          </div>

          <div>
            <label className="font-lato text-sm text-cream/90 uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-cream focus:outline-none transition-all font-lato"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-cream text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream hover:text-charcoal transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-lato"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
