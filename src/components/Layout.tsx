import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

export default function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <Outlet />
      </div>
      <ChatBot />
    </div>
  );
}
