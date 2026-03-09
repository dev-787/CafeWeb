import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function FullMenuPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});

  const allMenuItems = {
    coffee: [
      { id: 'esp', name: 'Espresso', description: 'Rich and bold single shot of espresso.', price: 2.50 },
      { id: 'ame', name: 'Americano', description: 'Espresso with hot water for a smooth, robust flavor.', price: 3.00 },
      { id: 'lat', name: 'Latte', description: 'Espresso with steamed milk and a light layer of foam.', price: 4.00 },
      { id: 'cap', name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam.', price: 4.00 },
      { id: 'fla', name: 'Flat White', description: 'Silky microfoam over a double shot of espresso.', price: 4.00 },
      { id: 'mac', name: 'Macchiato', description: 'Espresso marked with a dollop of frothy steamed milk.', price: 4.00 },
      { id: 'moc', name: 'Mocha', description: 'Espresso, steamed milk, and rich chocolate syrup, topped with whipped cream.', price: 4.00 },
      { id: 'col', name: 'Cold Brew', description: 'Smooth and refreshing cold-brewed coffee, served over ice.', price: 4.00 }
    ],
    specialtyLattes: [
      { id: 'mat', name: 'Matcha Latte', description: 'Premium matcha powder blended with steamed milk.', price: 4.50 },
      { id: 'tur', name: 'Turmeric Latte', description: 'Turmeric, ginger, and cinnamon blended with steamed milk for a healthy, golden drink.', price: 4.50 },
      { id: 'cha', name: 'Chai Latte', description: 'Spiced chai tea blended with steamed milk.', price: 4.00 },
      { id: 'hon', name: 'Honey Lavender Latte', description: 'Espresso, steamed milk, honey, and a hint of lavender.', price: 5.00 },
      { id: 'van', name: 'Vanilla Latte', description: 'Classic espresso with vanilla syrup and steamed milk.', price: 4.50 }
    ],
    teaAndBeverages: [
      { id: 'tea', name: 'Tea', description: 'Selection of black, green, and herbal teas.', price: 3.00 },
      { id: 'hot', name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate, topped with whipped cream.', price: 4.50 },
      { id: 'gol', name: 'Golden Milk', description: 'Turmeric, ginger, and honey blended with steamed milk.', price: 4.00 },
      { id: 'ice', name: 'Iced Tea', description: 'Freshly brewed and chilled, served over ice.', price: 5.00 },
      { id: 'lem', name: 'Lemonade', description: 'Fresh squeezed lemonade, perfectly sweetened.', price: 3.50 }
    ]
  };

  const updateQuantity = (itemId, change) => {
    setCart(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);
      
      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [itemId]: newQty };
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    let total = 0;
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = Object.values(allMenuItems).flat().find(i => i.id === itemId);
      if (item) total += item.price * qty;
    });
    return total.toFixed(2);
  };

  const MenuItem = ({ item }) => {
    const quantity = cart[item.id] || 0;

    return (
      <div className="bg-[#F9E7B4] rounded-2xl p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-[#1C4D19] font-semibold" style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
          }}>
            {item.name}
          </h4>
          <span className="text-[#1C4D19] font-semibold whitespace-nowrap ml-4" style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
          }}>
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-[#1C4D19] opacity-70 mb-4" style={{
          fontSize: 'clamp(0.875rem, 1.25vw, 0.9375rem)',
          lineHeight: '1.5'
        }}>
          {item.description}
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateQuantity(item.id, -1)}
            className="w-8 h-8 rounded-full border-2 border-[#1C4D19] text-[#1C4D19] flex items-center justify-center hover:bg-[#1C4D19] hover:text-[#FAF1D7] transition-all"
            style={{ fontSize: '1.25rem', fontWeight: 600 }}
          >
            -
          </button>
          <span className="text-[#1C4D19] font-semibold min-w-[2rem] text-center" style={{
            fontSize: 'clamp(1rem, 1.25vw, 1.125rem)'
          }}>
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, 1)}
            className="w-8 h-8 rounded-full border-2 border-[#1C4D19] text-[#1C4D19] flex items-center justify-center hover:bg-[#1C4D19] hover:text-[#FAF1D7] transition-all"
            style={{ fontSize: '1.25rem', fontWeight: 600 }}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF1D7]">
      <Navbar />
      
      <section className="px-6 lg:px-12 py-16 lg:py-24 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/')}
              className="text-[#1C4D19] mb-6 flex items-center gap-2 hover:opacity-70 transition-opacity"
              style={{ fontSize: 'clamp(1rem, 1.25vw, 1.125rem)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-[#1C4D19]" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Full Menu
            </h1>
          </div>

          {/* Coffee Section */}
          <div className="mb-16">
            <h2 className="text-[#1C4D19] mb-6" style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 600
            }}>
              Coffee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMenuItems.coffee.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Specialty Lattes Section */}
          <div className="mb-16">
            <h2 className="text-[#1C4D19] mb-6" style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 600
            }}>
              Specialty Lattes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMenuItems.specialtyLattes.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Tea & Other Beverages Section */}
          <div className="mb-16">
            <h2 className="text-[#1C4D19] mb-6" style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 600
            }}>
              Tea & Other Beverages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMenuItems.teaAndBeverages.map(item => (
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Order Now Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1C4D19] py-6 px-6 shadow-lg z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <button
              onClick={() => alert(`Order placed! Total: $${getTotalPrice()} for ${getTotalItems()} items`)}
              className="bg-[#FAF1D7] text-[#1C4D19] px-12 py-4 rounded-full font-semibold hover:bg-[#F9E7B4] transition-all flex items-center gap-4"
              style={{ fontSize: 'clamp(1rem, 1.25vw, 1.125rem)' }}
            >
              <span>Order Now</span>
              <span className="bg-[#1C4D19] text-[#FAF1D7] px-4 py-1 rounded-full">
                {getTotalItems()} items • ${getTotalPrice()}
              </span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
