import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'coffee',        label: 'Coffee',           emoji: '☕', id: 'section-coffee' },
  { key: 'specialtyLattes', label: 'Specialty Lattes', emoji: '✨', id: 'section-specialty' },
  { key: 'teaAndBeverages', label: 'Tea & Beverages',  emoji: '🍵', id: 'section-tea' },
];

const allMenuItems = {
  coffee: [
    { id: 'esp', name: 'Espresso',    description: 'Rich and bold single shot of espresso.',                                                          price: 2.50 },
    { id: 'ame', name: 'Americano',   description: 'Espresso with hot water for a smooth, robust flavor.',                                            price: 3.00 },
    { id: 'lat', name: 'Latte',       description: 'Espresso with steamed milk and a light layer of foam.',                                           price: 4.00 },
    { id: 'cap', name: 'Cappuccino',  description: 'Equal parts espresso, steamed milk, and foam.',                                                   price: 4.00 },
    { id: 'fla', name: 'Flat White',  description: 'Silky microfoam over a double shot of espresso.',                                                 price: 4.00 },
    { id: 'mac', name: 'Macchiato',   description: 'Espresso marked with a dollop of frothy steamed milk.',                                           price: 4.00 },
    { id: 'moc', name: 'Mocha',       description: 'Espresso, steamed milk, and rich chocolate syrup, topped with whipped cream.',                    price: 4.00 },
    { id: 'col', name: 'Cold Brew',   description: 'Smooth and refreshing cold-brewed coffee, served over ice.',                                      price: 4.00 },
  ],
  specialtyLattes: [
    { id: 'mat', name: 'Matcha Latte',          description: 'Premium matcha powder blended with steamed milk.',                                      price: 4.50 },
    { id: 'tur', name: 'Turmeric Latte',        description: 'Turmeric, ginger, and cinnamon blended with steamed milk for a healthy, golden drink.', price: 4.50 },
    { id: 'cha', name: 'Chai Latte',            description: 'Spiced chai tea blended with steamed milk.',                                            price: 4.00 },
    { id: 'hon', name: 'Honey Lavender Latte',  description: 'Espresso, steamed milk, honey, and a hint of lavender.',                                price: 5.00 },
    { id: 'van', name: 'Vanilla Latte',         description: 'Classic espresso with vanilla syrup and steamed milk.',                                 price: 4.50 },
  ],
  teaAndBeverages: [
    { id: 'tea', name: 'Tea',           description: 'Selection of black, green, and herbal teas.',                  price: 3.00 },
    { id: 'hot', name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate, topped with whipped cream.',    price: 4.50 },
    { id: 'gol', name: 'Golden Milk',   description: 'Turmeric, ginger, and honey blended with steamed milk.',       price: 4.00 },
    { id: 'ice', name: 'Iced Tea',      description: 'Freshly brewed and chilled, served over ice.',                 price: 5.00 },
    { id: 'lem', name: 'Lemonade',      description: 'Fresh squeezed lemonade, perfectly sweetened.',                price: 3.50 },
  ],
};

const flatItems = Object.values(allMenuItems).flat();

// ── MenuItem card ──────────────────────────────────────────────────────────
function MenuItem({ item, quantity, onUpdate, emoji }) {
  return (
    <div className="bg-[#F9E7B4] rounded-2xl p-6 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-default">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-4xl leading-none select-none">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-[#1C4D19] font-semibold text-base lg:text-lg leading-tight">{item.name}</h4>
            <span className="text-[#1C4D19] font-semibold text-base lg:text-lg whitespace-nowrap">${item.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <p className="text-[#1C4D19] opacity-70 text-sm leading-relaxed mb-4 ml-12">{item.description}</p>

      {/* Quantity pill */}
      <div className="ml-12">
        <div className="inline-flex items-center gap-3 bg-[#1C4D19]/10 rounded-full px-3 py-1.5 transition-all duration-200">
          <button
            onClick={() => onUpdate(item.id, -1)}
            className="w-7 h-7 rounded-full border-2 border-[#1C4D19] text-[#1C4D19] flex items-center justify-center hover:bg-[#1C4D19] hover:text-[#FAF1D7] transition-all font-bold text-lg leading-none"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="text-[#1C4D19] font-semibold min-w-[1.5rem] text-center tabular-nums">{quantity}</span>
          <button
            onClick={() => onUpdate(item.id, 1)}
            className="w-7 h-7 rounded-full border-2 border-[#1C4D19] text-[#1C4D19] flex items-center justify-center hover:bg-[#1C4D19] hover:text-[#FAF1D7] transition-all font-bold text-lg leading-none"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order modal ────────────────────────────────────────────────────────────
function OrderModal({ totalItems, totalPrice, onConfirm, onClose, loading }) {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !tableNumber) return;
    onConfirm(customerName.trim(), tableNumber);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        className="relative bg-[#FAF1D7] rounded-3xl shadow-2xl w-full max-w-md p-8"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1,   opacity: 1, y: 0  }}
        exit={{   scale: 0.9, opacity: 0, y: 20  }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2 className="text-2xl font-bold text-[#1C4D19] mb-1">Almost there!</h2>
        <p className="text-[#1C4D19]/70 text-sm mb-6">
          {totalItems} item{totalItems !== 1 ? 's' : ''} · <span className="font-semibold">${totalPrice}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1C4D19] mb-1.5">Your Name</label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              required
              placeholder="e.g. Alex"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#1C4D19]/20 bg-white focus:border-[#1C4D19] outline-none transition text-[#1C4D19] placeholder:text-[#1C4D19]/40"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1C4D19] mb-1.5">Table Number</label>
            <input
              type="number"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              required
              min="1"
              max="20"
              placeholder="1 – 20"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#1C4D19]/20 bg-white focus:border-[#1C4D19] outline-none transition text-[#1C4D19] placeholder:text-[#1C4D19]/40"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-[#1C4D19]/30 text-[#1C4D19] font-semibold hover:bg-[#1C4D19]/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-[#1C4D19] text-[#FAF1D7] font-semibold hover:bg-[#2A5D29] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing…' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({ orderId, onBack }) {
  return (
    <div className="min-h-screen bg-[#FAF1D7] flex items-center justify-center p-6">
      <motion.div
        className="text-center max-w-md"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* Animated checkmark */}
        <motion.div
          variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 className="w-24 h-24 text-[#1C4D19]" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="text-4xl font-bold text-[#1C4D19] mb-3"
        >
          Order Placed!
        </motion.h1>

        <motion.p
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="text-[#1C4D19]/70 text-lg mb-2"
        >
          Estimated time: 20–25 minutes
        </motion.p>

        <motion.p
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="text-[#1C4D19]/50 text-sm font-mono mb-8"
        >
          Order ID: {orderId}
        </motion.p>

        <motion.button
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          onClick={onBack}
          className="bg-[#1C4D19] text-[#FAF1D7] px-10 py-4 rounded-full font-semibold hover:bg-[#2A5D29] transition-all text-lg"
        >
          Back to Menu
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export function FullMenuPage() {
  const navigate = useNavigate();
  const [cart, setCart]               = useState({});
  const [showModal, setShowModal]     = useState(false);
  const [ordering, setOrdering]       = useState(false);
  const [successId, setSuccessId]     = useState(null);
  const [activeSection, setActiveSection] = useState('coffee');

  const sectionRefs = {
    coffee:           useRef(null),
    specialtyLattes:  useRef(null),
    teaAndBeverages:  useRef(null),
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // IntersectionObserver for sticky nav highlight
  useEffect(() => {
    const observers = [];
    CATEGORIES.forEach(({ key }) => {
      const el = sectionRefs[key].current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(key); },
        { rootMargin: '-30% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const updateQuantity = (itemId, change) => {
    setCart(prev => {
      const qty = Math.max(0, (prev[itemId] || 0) + change);
      if (qty === 0) { const { [itemId]: _, ...rest } = prev; return rest; }
      return { ...prev, [itemId]: qty };
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((s, q) => s + q, 0);
  const getTotalPrice = () => {
    let t = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const item = flatItems.find(i => i.id === id);
      if (item) t += item.price * qty;
    });
    return t.toFixed(2);
  };

  const cartLines = Object.entries(cart)
    .map(([id, qty]) => { const item = flatItems.find(i => i.id === id); return item ? { ...item, qty } : null; })
    .filter(Boolean);

  const scrollToSection = (key) => {
    sectionRefs[key].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleConfirmOrder = async (customerName, tableNumber) => {
    setOrdering(true);
    try {
      const items = cartLines.map(i => ({ id: i.id, name: i.name, quantity: i.qty, price: i.price }));
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, tableNumber, items, totalAmount: parseFloat(getTotalPrice()) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to place order');

      setShowModal(false);
      setSuccessId(data.orderId);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error("Oops! Could not place order. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (successId) {
    return <SuccessScreen orderId={successId} onBack={() => { setCart({}); setSuccessId(null); }} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF1D7]">

      {/* ── Sticky category nav ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#FAF1D7]/90 backdrop-blur-md border-b border-[#1C4D19]/10 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => scrollToSection(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeSection === key
                  ? 'bg-[#1C4D19] text-[#FAF1D7] shadow-md'
                  : 'border-2 border-[#1C4D19]/30 text-[#1C4D19] hover:border-[#1C4D19] hover:bg-[#1C4D19]/5'
              }`}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main layout ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 pb-36 lg:pb-16 flex gap-10">

        {/* Left: menu sections */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate('/')}
              className="text-[#1C4D19] mb-6 flex items-center gap-2 hover:opacity-70 transition-opacity text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-[#1C4D19] font-bold tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Full Menu
            </h1>
          </div>

          {CATEGORIES.map(({ key, label, emoji }) => (
            <div key={key} ref={sectionRefs[key]} className="mb-16 scroll-mt-20">
              <h2 className="text-[#1C4D19] font-semibold mb-6 flex items-center gap-3" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                <span className="text-4xl">{emoji}</span> {label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allMenuItems[key].map(item => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    quantity={cart[item.id] || 0}
                    onUpdate={updateQuantity}
                    emoji={emoji}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: sticky order summary (desktop only) */}
        {getTotalItems() > 0 && (
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl p-6 border border-[#1C4D19]/10">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-[#1C4D19]" />
                <h3 className="font-bold text-[#1C4D19] text-lg">Your Order</h3>
              </div>

              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {cartLines.map(item => (
                  <div key={item.id} className="flex justify-between text-sm text-[#1C4D19]">
                    <span className="truncate mr-2">{item.qty}× {item.name}</span>
                    <span className="font-semibold whitespace-nowrap">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1C4D19]/10 pt-3 mb-4 flex justify-between font-bold text-[#1C4D19]">
                <span>{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}</span>
                <span>${getTotalPrice()}</span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[#1C4D19] text-[#FAF1D7] py-3.5 rounded-2xl font-semibold hover:bg-[#2A5D29] transition-all"
              >
                Order Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile bottom bar ────────────────────────────────────────────── */}
      <AnimatePresence>
        {getTotalItems() > 0 && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 py-5 px-6 z-50 lg:hidden"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={{   y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="max-w-lg mx-auto">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-[#1C4D19] text-[#FAF1D7] px-8 py-4 rounded-full font-semibold hover:bg-[#2A5D29] transition-all flex items-center justify-between shadow-2xl"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                </span>
                <span className="bg-[#FAF1D7] text-[#1C4D19] px-4 py-1 rounded-full text-sm font-bold">
                  {getTotalItems()} · ${getTotalPrice()}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Order modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <OrderModal
            totalItems={getTotalItems()}
            totalPrice={getTotalPrice()}
            onConfirm={handleConfirmOrder}
            onClose={() => !ordering && setShowModal(false)}
            loading={ordering}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
