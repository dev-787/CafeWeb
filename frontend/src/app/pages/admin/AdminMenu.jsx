import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import adminApi from '../../../services/adminApi';

export function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'coffee',
    description: '',
    image: '',
    available: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const result = await adminApi.getMenuItems();
      setMenuItems(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description || '',
        image: item.image || '',
        available: item.available
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        price: '',
        category: 'coffee',
        description: '',
        image: '',
        available: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingItem) {
        await adminApi.updateMenuItem(editingItem._id, data);
        alert('Menu item updated successfully!');
      } else {
        await adminApi.createMenuItem(data);
        alert('Menu item created successfully!');
      }
      
      handleCloseModal();
      fetchMenuItems();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (itemId, itemName) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
      return;
    }

    try {
      await adminApi.deleteMenuItem(itemId);
      alert('Menu item deleted successfully!');
      fetchMenuItems();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await adminApi.updateMenuItem(item._id, { available: !item.available });
      fetchMenuItems();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      coffee: '☕',
      tea: '🍵',
      snacks: '🍪',
      desserts: '🍰',
      beverages: '🥤',
      meals: '🍽️'
    };
    return icons[category] || '🍽️';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading menu...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-600 mt-2">Add, edit, or remove menu items</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#1C4D19] text-white rounded-lg hover:bg-[#2d7a26] transition font-semibold"
        >
          + Add New Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2 capitalize">{item.category}</p>
              {item.description && (
                <p className="text-sm text-gray-700 mb-4">{item.description}</p>
              )}
              <p className="text-2xl font-bold text-green-600 mb-4">₹{item.price}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`flex-1 px-4 py-2 rounded-lg transition text-sm ${
                    item.available
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {item.available ? '🚫 Disable' : '✓ Enable'}
                </button>
                <button
                  onClick={() => handleDelete(item._id, item.name)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4D19] focus:border-transparent outline-none"
                    placeholder="e.g., Cappuccino"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4D19] focus:border-transparent outline-none"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4D19] focus:border-transparent outline-none"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="snacks">Snacks</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                    <option value="meals">Meals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4D19] focus:border-transparent outline-none"
                    placeholder="Brief description of the item"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4D19] focus:border-transparent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-[#1C4D19] border-gray-300 rounded focus:ring-[#1C4D19]"
                  />
                  <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                    Available for order
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#1C4D19] text-white rounded-lg hover:bg-[#2d7a26] transition"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
