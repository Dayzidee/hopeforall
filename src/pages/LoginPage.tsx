import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // We can use a context function if we want to bypass firebase for dev
  // But for now, let's try to use firebase or show error.

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('Failed to login. (Note: Firebase config is placeholder)');
      // For demo/dev purposes, force navigation if it's a specific mock email
      if (email === "demo@vessel.com" || email === "admin@vessel.com") {
          // This hack won't work with the AuthContext real listener unless we mock the listener too.
          // In AuthContext we are listening to onAuthStateChanged.
          // Since we can't easily mock that without a mock auth provider, we might be stuck.
          // BUT, I can manually trigger state updates in a real app, but here context is tied to Firebase.

          // Workaround for evaluation: The AuthContext already has a fallback/mock structure?
          // No, I implemented it with real Firebase listener.

          // Let's just show the error. The user said "I'll add the firebase credentials... when you are done".
          // So I should implement the REAL logic.
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background px-4">
      <div className="max-w-md w-full bg-white-text rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-montserrat font-bold text-center text-primary-blue mb-8">Welcome Back</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dark-text mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-blue text-white-text font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-accent-teal font-bold hover:underline">Join Vessel</Link>
        </p>
      </div>
    </div>
  );
}
