import { useState } from 'react';
import { login, register, saveToken } from '../api';

const parseJwt = (token) => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch { return null; }
};

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        if (!res || !res.token) throw new Error('Login failed');
        saveToken(res.token);
        const user = parseJwt(res.token);
        onLogin && onLogin(user);
      } else {
        await register({ name, email, password });
        // auto-login after register
        const res = await login({ email, password });
        if (!res || !res.token) throw new Error('Auto-login failed');
        saveToken(res.token);
        const user = parseJwt(res.token);
        onLogin && onLogin(user);
      }
      onClose && onClose();
    } catch (err) {
      setError(err.message || 'Auth failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-modal">
      <div className="auth-panel">
        <button className="close" onClick={onClose}>✕</button>
        <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {error && <div className="error">{error}</div>}
          <button className="btn primary" disabled={loading}>{loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Register')}</button>
        </form>
        <div className="auth-toggle">
          {mode === 'login' ? (
            <p>Don't have an account? <button onClick={() => setMode('register')}>Register</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setMode('login')}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
