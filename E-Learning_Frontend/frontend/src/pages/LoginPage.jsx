// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { loginApi } from '../api/authApi';
// import { useAuth } from '../context/AuthContext';

// export default function LoginPage() {
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const submit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const data = await loginApi(form);
//       login(data);
//       navigate(location.state?.from || '/courses', { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <form className="card auth-card" onSubmit={submit}>
//         <span className="badge">Learner Login</span>
//         <h1>Sign in to E-Learning</h1>
//         <p className="muted">Use Account_Username and the learner password from your database.</p>

//         <label>
//           Username
//           <input
//             value={form.username}
//             onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
//             placeholder="Enter username"
//           />
//         </label>

//         <label>
//           Password
//           <input
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
//             placeholder="Enter password"
//           />
//         </label>

//         {error ? <div className="alert error">{error}</div> : null}

//         <button className="primary-btn full" type="submit" disabled={loading}>
//           {loading ? 'Signing in...' : 'Login'}
//         </button>

//         <div className="sample-box">
//           <strong>Login note:</strong>
//           <ul>
//             <li><code>Username</code> = value from <code>Accounts.Account_Username</code></li>
//             <li>Account must have role <code>Learner</code> and status <code>Active</code></li>
//             <li>That account must map to a row in the <code>Learner</code> table</li>
//           </ul>
//         </div>

//         <Link className="ghost-btn full" to="/">Back to home</Link>
//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(form);
      login(data);
      navigate(location.state?.from || '/courses', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    window.location.href =
      'http://127.0.0.1:5500/E-Learning_Frontend/General/pages/register_account.html';
  };

  return (
    <div className="auth-page">
      <form className="card auth-card clean-login-card" onSubmit={submit}>
        <div className="login-top">
          <span className="badge">Learner Portal</span>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to continue your learning journey.</p>
        </div>

        <div className="auth-fields">
          <label>
            Username
            <input
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="Enter username"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter password"
            />
          </label>
        </div>

        {error ? <div className="alert error">{error}</div> : null}

        <button className="primary-btn full" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="secondary-btn full"
          onClick={goToRegister}
        >
          Register new account
        </button>

        <Link className="ghost-btn full" to="/">
          Back to dashboard
        </Link>
      </form>
    </div>
  );
}