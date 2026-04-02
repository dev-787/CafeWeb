import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Clock, ChefHat, CheckCircle2, DollarSign,
  TrendingUp, ArrowRight, RefreshCw, ShoppingBag
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import adminApi from '../../../services/adminApi';

function StatCard({ title, value, Icon, bg, iconColor, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> Live
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function RecentOrderRow({ order }) {
  const statusColors = {
    pending:   'bg-amber-100 text-amber-700',
    preparing: 'bg-blue-100 text-blue-700',
    ready:     'bg-emerald-100 text-emerald-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 bg-[#1C4D19]/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="w-4 h-4 text-[#1C4D19]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{order.customerName}</p>
        <p className="text-xs text-gray-400">Table {order.tableNumber} · {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-800">${(order.totalAmount || 0).toFixed(2)}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [stats,   setStats]   = useState({ total: 0, pending: 0, preparing: 0, completed: 0, revenue: 0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 15000);
    return () => clearInterval(id);
  }, []);

  const fetchStats = async () => {
    try {
      const result = await adminApi.getOrders();
      const orders = result.data || [];
      const today  = new Date().toDateString();
      const revenue = orders
        .filter(o => o.status !== 'cancelled' && new Date(o.createdAt).toDateString() === today)
        .reduce((s, o) => s + (o.totalAmount || 0), 0);

      setStats({
        total:     orders.length,
        pending:   orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        revenue,
      });
      setRecent(orders.slice(0, 5));
      setLastUpdated(new Date());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin w-8 h-8 text-[#1C4D19]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-gray-400 text-sm">Loading dashboard…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Welcome back'}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Orders"  value={stats.total}     Icon={Package}      bg="bg-blue-50"    iconColor="text-blue-600"   trend />
        <StatCard title="Pending"       value={stats.pending}   Icon={Clock}        bg="bg-amber-50"   iconColor="text-amber-600"  trend />
        <StatCard title="Preparing"     value={stats.preparing} Icon={ChefHat}      bg="bg-orange-50"  iconColor="text-orange-600" trend />
        <StatCard title="Completed"     value={stats.completed} Icon={CheckCircle2} bg="bg-emerald-50" iconColor="text-emerald-600" />
        <div className="col-span-2 lg:col-span-1 bg-[#1C4D19] rounded-2xl p-6 shadow-sm">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/70 text-sm font-medium">Revenue Today</p>
          <p className="text-3xl font-bold text-white mt-1">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-[#1C4D19] text-sm font-medium hover:underline">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No orders yet</p>
            </div>
          ) : (
            recent.map(o => <RecentOrderRow key={o._id || o.orderId} order={o} />)
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/orders"
              className="flex items-center gap-3 p-4 bg-[#1C4D19]/5 hover:bg-[#1C4D19]/10 rounded-xl transition group">
              <div className="w-9 h-9 bg-[#1C4D19] rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Manage Orders</p>
                <p className="text-xs text-gray-400">{stats.pending} pending</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1C4D19] transition" />
            </Link>

            <Link to="/admin/menu"
              className="flex items-center gap-3 p-4 bg-[#1C4D19]/5 hover:bg-[#1C4D19]/10 rounded-xl transition group">
              <div className="w-9 h-9 bg-[#1C4D19] rounded-xl flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Edit Menu</p>
                <p className="text-xs text-gray-400">Add or update items</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1C4D19] transition" />
            </Link>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Auto-refresh</p>
              <p className="text-xs text-amber-600">Dashboard updates every 15 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
