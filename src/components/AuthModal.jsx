import { useState } from 'react';
import { login, register, saveToken } from '../api';

const parseJwt = (token) => {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch (e) { return null; }
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
        saveToken(res.token);
        const user = parseJwt(res.token);
        onLogin && onLogin(user);
      } else {
        await register({ name, email, password });
        // auto-login after register
        const res = await login({ email, password });
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
import { useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        const res = await apiLogin({ email, password });
        onAuthSuccess(res.token);
      } else {
        await apiRegister({ name, email, password });
        // after register, auto-login
        const res = await apiLogin({ email, password });
        onAuthSuccess(res.token);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  }

  return (
    <div className="auth-modal">
      <div className="auth-card">
        <button className="close" onClick={onClose}>×</button>
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {mode === 'login' ? 'No account?' : 'Have an account?'}
          <button className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Register' : 'Login'}</button>
        </p>
      </div>
    </div>
  );
}
