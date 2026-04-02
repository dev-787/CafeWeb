import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, UtensilsCrossed, LogOut, Coffee, Menu, X } from 'lucide-react';
import adminApi from '../../../services/adminApi';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/orders',    label: 'Orders',    Icon: Package },
  { to: '/admin/menu',      label: 'Menu',      Icon: UtensilsCrossed },
];

function Sidebar({ onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    adminApi.removeToken();
    navigate('/admin/login');
  };

  return (
    <div className="w-64 h-full bg-[#0f2d0d] flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Café Admin</p>
            <p className="text-white/40 text-xs mt-0.5">Management Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-3 mb-2">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, label, Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                active ? 'bg-white/20' : 'bg-transparent'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-white/40 text-xs">Logged in as</p>
          <p className="text-white/70 text-xs font-medium truncate">admin@cafe.com</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C4D19] flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
