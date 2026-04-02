import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, X, UtensilsCrossed } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import adminApi from '../../../services/adminApi';

const CATEGORY_CONFIG = {
  coffee:    { emoji: '☕', label: 'Coffee',    color: 'bg-amber-50 text-amber-700 border-amber-200' },
  specialty: { emoji: '✨', label: 'Specialty', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  beverages: { emoji: '🥤', label: 'Beverages', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  tea:       { emoji: '🍵', label: 'Tea',       color: 'bg-green-50 text-green-700 border-green-200' },
  snacks:    { emoji: '🍪', label: 'Snacks',    color: 'bg-orange-50 text-orange-700 border-orange-200' },
  desserts:  { emoji: '🍰', label: 'Desserts',  color: 'bg-pink-50 text-pink-700 border-pink-200' },
  meals:     { emoji: '🍽️', label: 'Meals',     color: 'bg-red-50 text-red-700 border-red-200' },
};

function DeleteDialog({ itemName, onConfirm, children }) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <AlertDialog.Title className="text-lg font-bold text-gray-900 mb-1">Delete item?</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-gray-500 mb-6">
            <strong className="text-gray-700">"{itemName}"</strong> will be permanently removed.
          </AlertDialog.Description>
          <div className="flex gap-3">
            <AlertDialog.Cancel className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-semibold">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold">
              Delete
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

const EMPTY_FORM = { name: '', price: '', category: 'coffee', description: '', image: '', available: true };

export function AdminMenu() {
  const [menuItems,   setMenuItems]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData,    setFormData]    = useState(EMPTY_FORM);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('all');

  useEffect(() => { fetchMenuItems(); }, []);

  const fetchMenuItems = async () => {
    try {
      const result = await adminApi.getMenuItems();
      setMenuItems(result.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item
      ? { name: item.name, price: item.price, category: item.category, description: item.description || '', image: item.image || '', available: item.available }
      : EMPTY_FORM
    );
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: parseFloat(formData.price) };
      if (editingItem) {
        await adminApi.updateMenuItem(editingItem._id, data);
        toast.success('Item updated');
      } else {
        await adminApi.createMenuItem(data);
        toast.success('Item added to menu');
      }
      setShowModal(false);
      fetchMenuItems();
    } catch (err) {
      toast.error(err.message || 'Failed to save item');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await adminApi.deleteMenuItem(itemId);
      toast.success('Item removed');
      fetchMenuItems();
    } catch (err) {
      toast.error(err.message || 'Failed to delete item');
    }
  };

  const handleToggle = async (item) => {
    try {
      await adminApi.updateMenuItem(item._id, { available: !item.available });
      toast.success(item.available ? 'Item disabled' : 'Item enabled');
      fetchMenuItems();
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === 'all' || item.category === catFilter;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <svg className="animate-spin w-8 h-8 text-[#1C4D19]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-400 text-sm mt-1">{menuItems.length} items · {menuItems.filter(i => i.available).length} available</p>
        </div>
        <button onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1C4D19] text-white rounded-xl hover:bg-[#2d7a26] transition text-sm font-semibold shadow-sm">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...Object.keys(CATEGORY_CONFIG)].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                catFilter === cat ? 'bg-[#1C4D19] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {cat === 'all' ? 'All' : `${CATEGORY_CONFIG[cat]?.emoji} ${CATEGORY_CONFIG[cat]?.label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">No items found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => {
            const catCfg = CATEGORY_CONFIG[item.category] || { emoji: '🍽️', label: item.category, color: 'bg-gray-50 text-gray-600 border-gray-200' };
            return (
              <div key={item._id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${!item.available ? 'opacity-60' : ''}`}>
                {item.image && (
                  <div className="h-40 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl flex-shrink-0">{catCfg.emoji}</span>
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${item.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {item.available ? 'On' : 'Off'}
                    </span>
                  </div>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border mb-2 ${catCfg.color}`}>
                    {catCfg.label}
                  </span>
                  {item.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>}
                  <p className="text-2xl font-bold text-[#1C4D19] mb-4">${Number(item.price).toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(item)}
                      className="flex items-center gap-1.5 flex-1 justify-center py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-xs font-semibold">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleToggle(item)}
                      className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl transition text-xs font-semibold ${item.available ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                      {item.available ? <><ToggleRight className="w-3.5 h-3.5" /> Disable</> : <><ToggleLeft className="w-3.5 h-3.5" /> Enable</>}
                    </button>
                    <DeleteDialog itemName={item.name} onConfirm={() => handleDelete(item._id)}>
                      <button className="flex items-center justify-center w-9 h-9 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </DeleteDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                <p className="text-sm text-gray-400 mt-0.5">{editingItem ? 'Update details' : 'Add to your menu'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required placeholder="e.g. Cappuccino"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price ($) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required min="0" step="0.01" placeholder="4.00"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition">
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.emoji} {v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3} placeholder="Brief description…"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1C4D19]/20 focus:border-[#1C4D19] outline-none text-sm transition" />
              </div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                <input type="checkbox" checked={formData.available} onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4 accent-[#1C4D19]" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Available for order</p>
                  <p className="text-xs text-gray-400">Customers can add this to their cart</p>
                </div>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-semibold">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 bg-[#1C4D19] text-white rounded-xl hover:bg-[#2d7a26] transition text-sm font-semibold shadow-sm">
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
