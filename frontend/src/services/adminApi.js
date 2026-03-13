const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AdminApiService {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('adminToken');
  }

  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('adminToken', token);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem('adminToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Admin login
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    this.setToken(data.data.token);
    return data;
  }

  // Get all orders
  async getOrders(filters = {}) {
    const token = this.getToken();
    const params = new URLSearchParams(filters);
    
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    
    if (!data.success) {
      if (response.status === 401) {
        this.removeToken();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  }

  // Verify payment
  async verifyPayment(orderId, approved) {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/verify-payment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ approved })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to verify payment');
    }

    return data;
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update order status');
    }

    return data;
  }

  // Get all menu items
  async getMenuItems() {
    const response = await fetch(`${API_BASE_URL}/api/menu`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch menu items');
    }

    return data;
  }

  // Create menu item
  async createMenuItem(menuData) {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(menuData)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to create menu item');
    }

    return data;
  }

  // Update menu item
  async updateMenuItem(menuId, updates) {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/menu/${menuId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update menu item');
    }

    return data;
  }

  // Delete menu item
  async deleteMenuItem(menuId) {
    const token = this.getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/menu/${menuId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete menu item');
    }

    return data;
  }
}

export default new AdminApiService();
