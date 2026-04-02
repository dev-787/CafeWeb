import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, Clock, ChefHat, CheckCircle2, XCircle, User, MapPin, DollarSign, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import adminApi from '../../../services/adminApi';

const FILTERS = [
  { key: 'all',       label: 'All Orders' },
  { key: 'pending',   label: 'Pending' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready',     label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   cls: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-500' },
  preparing: { label: 'Preparing', cls: 'bg-blue-100 text-blue-700 border-blue-200',      dot: 'bg-blue-500' },
  ready:     { label: 'Ready',     cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-600 border-gray-200',      dot: 'bg-gray-400' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600 border-red-200',         dot: 'bg-red-500' },
};

const PAYMENT_CONFIG = {
  pending:              { label: 'Unpaid',       cls: 'bg-gray-100 text-gray-500' },
  verification_pending: { label: 'Verify UTR',   cls: 'bg-orange-100 text-orange-700' },
  paid:                 { label: 'Paid',         cls: 'bg-emerald-100 text-emerald-700' },
  rejected:             { label: 'Rejected',     cls: 'bg-red-100 text-red-600' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }) {
  const cfg = PAYMENT_CONFIG[status] || { label: status || '—', cls: 'bg-gray-100 text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onVerify, onStatus }) {
  const id = order._id || order.orderId || '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1C4D19]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-[#1C4D19]" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">#{id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-400">
              {order.createdAt ? new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-4">
        {/* Customer info row */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-300" />
            <span className="font-semibold text-gray-800">{order.customerName || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-300" />
            <span className="text-gray-600">Table {order.tableNumber || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm ml-auto">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-emerald-600">${(order.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">
                <span className="font-semibold text-gray-900">{item.quantity}×</span> {item.name}
              </span>
              <span className="font-medium text-gray-600">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {order.paymentStatus === 'verification_pending' && (
            <>
              <button onClick={() => onVerify(id, true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-xs font-semibold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payment
              </button>
              <button onClick={() => onVerify(id, false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-xs font-semibold shadow-sm">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          )}
          {order.status === 'pending' && (
            <button onClick={() => onStatus(id, 'preparing')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xs font-semibold shadow-sm">
              <ChefHat className="w-3.5 h-3.5" /> Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button onClick={() => onStatus(id, 'ready')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-xs font-semibold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button onClick={() => onStatus(id, 'completed')}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition text-xs font-semibold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
            </button>
          )}
          {!['completed', 'cancelled'].includes(order.status) && (
            <button onClick={() => onStatus(id, 'cancelled')}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition text-xs font-semibold ml-auto">
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 15000);
    return () => clearInterval(id);
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const filters = filter !== 'all' ? { status: filter } : {};
      const result  = await adminApi.getOrders(filters);
      setOrders(result.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (orderId, approved) => {
    try {
      await adminApi.verifyPayment(orderId, approved);
      toast.success(`Payment ${approved ? 'approved ✓' : 'rejected'}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to verify payment');
    }
  };

  const handleStatus = async (orderId, status) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Count per filter
  const counts = FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === 'all' ? orders.length : orders.filter(o => o.status === f.key).length;
    return acc;
  }, {});

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition text-sm font-medium shadow-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? 'bg-[#1C4D19] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f.label}
            {counts[f.key] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                filter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <svg className="animate-spin w-8 h-8 text-[#1C4D19]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">No orders found</h3>
          <p className="text-gray-400 text-sm">No orders match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {orders.map(order => (
            <OrderCard
              key={order._id || order.orderId}
              order={order}
              onVerify={handleVerify}
              onStatus={handleStatus}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
