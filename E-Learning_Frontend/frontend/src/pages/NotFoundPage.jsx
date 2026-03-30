import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>404</h1>
        <p className="muted">Page not found.</p>
        <Link className="primary-btn full" to="/">Back to home</Link>
      </div>
    </div>
  );
}
