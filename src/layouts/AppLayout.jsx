import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import NotificationDrawer from '../components/ui/NotificationDrawer';
import NotificationCenter from '../components/ui/NotificationCenter';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Toast-style Notification Center */}
      <NotificationCenter />

      {/* Sidebar — passes mobile state */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Sticky Topbar */}
        <Topbar 
          onMenuClick={() => setMobileOpen(true)} 
          onNotificationsClick={() => setNotificationsOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>

      </div>

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        open={notificationsOpen}
        setOpen={setNotificationsOpen}
      />
    </div>
  );
}
