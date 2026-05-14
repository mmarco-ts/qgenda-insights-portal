import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const marginLeft = sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main-wrapper" style={{ marginLeft }}>
        <Outlet />
      </div>
      <ChatBot />
    </div>
  );
}
