import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sparkles, FolderOpen } from 'lucide-react';
import { useCurrentUser } from '../lib/useCurrentUser';

export default function Sidebar() {
  const { user, loading } = useCurrentUser();
  const displayName = user?.displayName || (loading ? 'Loading…' : 'Guest');
  const userRole = user?.userName ? `@${user.userName}` : 'Sign in to QGenda Insights';
  const initials = user?.initials || (loading ? '…' : 'G');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">Q</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">QGenda</span>
            <span className="sidebar-logo-subtitle">Insights</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon">
              <Home size={20} />
            </span>
            <span className="nav-item-text">Home</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Workforce Analytics</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon">
              <LayoutDashboard size={20} />
            </span>
            <span className="nav-item-text">Workforce Dashboard</span>
          </NavLink>
          <NavLink
            to="/ai-analytics"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon">
              <Sparkles size={20} />
            </span>
            <span className="nav-item-text">Insights AI</span>
          </NavLink>
          <NavLink
            to="/my-reports"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-item-icon">
              <FolderOpen size={20} />
            </span>
            <span className="nav-item-text">My Reports</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{displayName}</div>
            <div className="sidebar-user-role">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
