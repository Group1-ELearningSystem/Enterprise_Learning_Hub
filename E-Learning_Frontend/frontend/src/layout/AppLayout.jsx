// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const menus = [
//   ['Courses', '/courses'],
//   ['My Courses', '/my-courses'],
//   ['Progress', '/progress'],
//   ['Financial Requests', '/financial-requests'],
//   ['Notifications', '/notifications'],
//   ['Recommendations', '/recommendations'],
//   ['Profile', '/profile']
// ];

// export default function AppLayout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <div className="app-shell">
//       <aside className="sidebar card">
//         <div>
//           <div className="brand">E-Learning</div>
//           <p className="muted small">Learner Portal</p>
//         </div>

//         <nav className="side-nav">
//           {menus.map(([label, path]) => (
//             <NavLink
//               key={path}
//               to={path}
//               className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
//             >
//               {label}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <div className="user-card">
//             <strong>{user?.username || 'Learner'}</strong>
//             <span>{user?.role || 'Learner'}</span>
//           </div>
//           <button className="ghost-btn full" onClick={handleLogout}>Logout</button>
//         </div>
//       </aside>

//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const menus = [
  ['Courses', '/courses'],
  ['My Courses', '/my-courses'],
  ['Progress', '/progress'],
  ['Financial Requests', '/financial-requests'],
  ['Notifications', '/notifications'],
  ['Recommendations', '/recommendations'],
  ['Profile', '/profile']
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    // window.location.href="http://127.0.0.1:5500/E-Learning_Frontend/General/pages/login.html"
  };

  return (
    <div className="app-shell">
      <aside className="sidebar card">
        <div className="sidebar-top">
          <div>
            <div className="brand">E-Learning</div>
            <p className="muted small">Learner Portal</p>
          </div>

          <button className="theme-btn full" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
          </button>

          <nav className="side-nav">
            {menus.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user?.username || 'Learner'}</strong>
            <span>{user?.role || 'Learner'}</span>
          </div>
          <button className="ghost-btn full" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}