import { Link, useNavigate, useLocation } from 'react-router-dom';
import adminApi from '../../../services/adminApi';

export function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    adminApi.removeToken();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1C4D19] text-white flex flex-col">
        <div className="p-6 border-b border-green-700">
          <h1 className="text-2xl font-bold">Café Admin</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <Link
            to="/admin/dashboard"
            className={`block px-4 py-3 rounded-lg mb-2 transition ${
              isActive('/admin/dashboard')
                ? 'bg-green-700 text-white'
                : 'hover:bg-green-700/50'
            }`}
          >
            📊 Dashboard
          </Link>
          
          <Link
            to="/admin/orders"
            className={`block px-4 py-3 rounded-lg mb-2 transition ${
              isActive('/admin/orders')
                ? 'bg-green-700 text-white'
                : 'hover:bg-green-700/50'
            }`}
          >
            📦 Orders
          </Link>
          
          <Link
            to="/admin/menu"
            className={`block px-4 py-3 rounded-lg mb-2 transition ${
              isActive('/admin/menu')
                ? 'bg-green-700 text-white'
                : 'hover:bg-green-700/50'
            }`}
          >
            🍽️ Menu
          </Link>
        </nav>
        
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
