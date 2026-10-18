import { useState } from 'react';
import { BookOpen, ArrowRight, Eye, EyeOff, ShieldCheck, UserCheck, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const fillDemo = (e, p) => {
    setMode('login');
    setEmail(e);
    setPassword(p);
    setError('');
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
        navigate('/');
      } else {
        await register({ name, email, password, phone });
        setNotice('Registration successful! Redirecting to workspace...');
        setTimeout(() => navigate('/'), 800);
      }
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-art">
        <div className="login-brand">
          <BookOpen /> APEX<span>LIB</span>
        </div>
        <div className="art-copy">
          <span className="eyebrow light">ENTERPRISE LIBRARY MANAGEMENT</span>
          <h1>
            Intelligent library
            <br />
            operations for <em>everyone</em>.
          </h1>
          <p>
            Complete cataloguing, real-time inventory tracking, multi-tier loan workflows, automated fines, and
            analytics powered by the MERN stack.
          </p>

          <div className="book-stack">
            <div className="book b1">
              CLEAN
              <br />
              CODE
            </div>
            <div className="book b2">
              DATA
              <br />
              SYSTEMS
            </div>
            <div className="book b3">
              PRAGMATIC
              <br />
              DEV
            </div>
            <div className="book b4">
              SAPIENS
              <br />
              HISTORY
            </div>
          </div>
        </div>
        <div className="art-footer">
          APEXLIB Production Release <span>v2.0</span>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-form-wrap">
          <div className="mobile-mark">
            <BookOpen /> APEX<span>LIB</span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: '#eef3eb',
              padding: '4px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              style={{
                flex: 1,
                border: 0,
                background: mode === 'login' ? '#174438' : 'transparent',
                color: mode === 'login' ? '#fff' : '#495a50',
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '12px',
                transition: '0.2s',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              style={{
                flex: 1,
                border: 0,
                background: mode === 'register' ? '#174438' : 'transparent',
                color: mode === 'register' ? '#fff' : '#495a50',
                padding: '8px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '12px',
                transition: '0.2s',
              }}
            >
              Student Register
            </button>
          </div>

          <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'CREATE STUDENT ACCOUNT'}</span>
          <h2>{mode === 'login' ? 'Sign in to APEXLIB' : 'Join the library'}</h2>
          <p className="muted">
            {mode === 'login' ? 'Select a demo role or enter your credentials.' : 'Register to borrow books, reserve copies, and track loans.'}
          </p>

          {/* Quick Demo Logins Chips */}
          {mode === 'login' && (
            <div
              style={{
                background: '#f4f7f2',
                border: '1px solid #dce5da',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#4f6a5b',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>⚡</span> QUICK DEMO LOGINS (CLICK TO FILL):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@library.local', 'Admin@123456')}
                  style={{
                    border: '1px solid #c9d8c4',
                    background: email === 'admin@library.local' ? '#1d5143' : '#fff',
                    color: email === 'admin@library.local' ? '#fff' : '#234438',
                    padding: '6px 4px',
                    borderRadius: '5px',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('sarah.librarian@library.local', 'Librarian@123456')}
                  style={{
                    border: '1px solid #c9d8c4',
                    background: email === 'sarah.librarian@library.local' ? '#1d5143' : '#fff',
                    color: email === 'sarah.librarian@library.local' ? '#fff' : '#234438',
                    padding: '6px 4px',
                    borderRadius: '5px',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <UserCheck size={14} />
                  <span>Librarian</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('john.doe@student.local', 'Member@123456')}
                  style={{
                    border: '1px solid #c9d8c4',
                    background: email === 'john.doe@student.local' ? '#1d5143' : '#fff',
                    color: email === 'john.doe@student.local' ? '#fff' : '#234438',
                    padding: '6px 4px',
                    borderRadius: '5px',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <GraduationCap size={14} />
                  <span>Student</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={submit}>
            {mode === 'register' && (
              <>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </>
            )}

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@library.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow(!show)}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mode === 'register' && (
              <>
                <label htmlFor="phone">Phone number (optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1-555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            {error && (
              <div role="alert" className="error-banner">
                {error}
              </div>
            )}

            {notice && (
              <div role="status" className="success-banner">
                <CheckCircle2 size={16} /> {notice}
              </div>
            )}

            <button className="primary-button full" disabled={busy}>
              {busy
                ? mode === 'login'
                  ? 'Signing in…'
                  : 'Registering…'
                : mode === 'login'
                ? 'Sign in to workspace'
                : 'Create Account'}{' '}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="login-note">
            <span>⌁</span> Fast, secure & verified on MERN stack
          </div>
        </div>

        <div className="login-bottom">
          <span>APEXLIB System · Production Ready</span>
          <span>Admin · Librarian · Student Portals</span>
        </div>
      </div>
    </div>
  );
}
