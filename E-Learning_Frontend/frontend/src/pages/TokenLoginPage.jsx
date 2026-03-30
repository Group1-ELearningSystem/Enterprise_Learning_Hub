import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TokenLoginPage() {
  const [token, setToken] = useState(localStorage.getItem('elearning_token') || '');
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please paste JWT token.');
      return;
    }
    loginWithToken(token);
    navigate(location.state?.from || '/courses', { replace: true });
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h1>Connect to learner API</h1>
        <p className="muted">
          The backend files you sent do not include a login endpoint, so this screen accepts a JWT token directly.
        </p>
        <label>
          JWT Token
          <textarea rows="8" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste Bearer token here..." />
        </label>
        {error ? <div className="alert error">{error}</div> : null}
        <button className="primary-btn full" type="submit">Save token and continue</button>
      </form>
    </div>
  );
}
