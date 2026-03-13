import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import adminApi from '../../../services/adminApi';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    preparing: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const result = await adminApi.getOrders();
      const orders = result.data || [];

      setStats({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        completed: orders.filter(o => o.status === 'completed').length
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your café overview.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon="📦"
          color="border-blue-500"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending}
          icon="⏳"
          color="border-yellow-500"
        />
        <StatCard
          title="Preparing"
          value={stats.preparing}
          icon="👨‍🍳"
          color="border-orange-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="border-green-500"
        />
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/orders"
            className="flex items-center justify-center px-6 py-4 bg-[#1C4D19] text-white rounded-lg hover:bg-[#2d7a26] transition"
          >
            <span className="mr-2">📋</span>
            View All Orders
          </a>
          <a
            href="/admin/menu"
            className="flex items-center justify-center px-6 py-4 bg-[#1C4D19] text-white rounded-lg hover:bg-[#2d7a26] transition"
          >
            <span className="mr-2">🍽️</span>
            Manage Menu
          </a>
          <button
            onClick={fetchStats}
            className="flex items-center justify-center px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <span className="mr-2">🔄</span>
            Refresh Data
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
