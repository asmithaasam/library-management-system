import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  LibraryBig,
  Users,
  ArrowLeftRight,
  Bookmark,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Bell,
  Boxes,
  Tags,
  ScrollText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  ['Overview', '/', 'admin,librarian,member', LayoutDashboard],
  ['Catalogue', '/catalogue', 'admin,librarian,member', LibraryBig],
  ['Inventory', '/inventory', 'admin,librarian', Boxes],
  ['Loans', '/loans', 'admin,librarian,member', ArrowLeftRight],
  ['Reservations', '/reservations', 'admin,librarian,member', Bookmark],
  ['Members', '/members', 'admin,librarian', Users],
  ['Categories', '/categories', 'admin,librarian', Tags],
  ['Fines', '/fines', 'admin,librarian,member', Wallet],
  ['Reports', '/reports', 'admin,librarian', ChartNoAxesCombined],
  ['Activity log', '/activity', 'admin', ScrollText],
  ['Settings', '/settings', 'admin', Settings],
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <BookOpen size={22} />
          </span>
          <span>
            APEX<span className="brand-dot">LIB</span>
            <small>ENTERPRISE LMS</small>
          </span>
        </div>
        <div className="workspace-label">PORTAL · {user?.role?.toUpperCase()}</div>
        <nav>
          {nav
            .filter((n) => n[2].split(',').includes(user?.role))
            .map(([label, to, roles, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>APEXLIB Guide</strong>
            <p>Access user guidelines and role capabilities.</p>
            <a
              href="/user-guide"
              onClick={(e) => {
                e.preventDefault();
                navigate('/user-guide');
              }}
            >
              Open guide ↗
            </a>
          </div>
          <button
            className="profile"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <div className="avatar">{user?.name?.slice(0, 1) || 'U'}</div>
            <div className="profile-info">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="crumb">
            <span>APEXLIB</span>
            <span className="crumb-slash">/</span>
            <strong>Workspace</strong>
          </div>
          <div className="top-actions">
            <span className="status-pill">
              <span /> System operational
            </span>
            <button className="icon-button" aria-label="Notifications" onClick={() => navigate('/notifications')}>
              <Bell size={18} />
            </button>
            <div className="top-avatar">{user?.name?.slice(0, 1) || 'U'}</div>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
