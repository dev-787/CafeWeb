import image_521291f69eecd6e2bbb7794248fd6b486128ec63 from '../assets/PRDfIQEwfBAD6WhfpVujpWW5c.png'
import image_147ad856c195441782a9c05c868f4ee4aab0988a from '../assets/rgN0P1vQKsq9ZG5BJOPaR9KY.png'
import image_9f32ff80f3517d38bfbee40687a98b292b5aaca0 from '../assets/i6aEvR24jRpFkZDao1hmf0YYo.png'
import latteImage from '../assets/Wj7gr7g3B7oONCaiJAc3UuqxH7k.jpg';
import coffeeTopViewImage from '../assets/ffAQuLErAZ9FhPrK3M7QLPo5g.png';

export function MenuSection() {
  const coffeeItems = [
    { name: 'Espresso', description: 'Rich and bold single shot of espresso.', price: '$2.50' },
    { name: 'Americano', description: 'Espresso with hot water for a smooth, robust flavor.', price: '$3.00' },
    { name: 'Latte', description: 'Espresso with steamed milk and a light layer of foam.\nFlavors: Vanilla, Caramel, Hazelnut, Mocha.', price: '$4.00' },
    { name: 'Cappuccino', description: 'Equal parts espresso, steamed milk, and foam.', price: '$4.00' },
    { name: 'Flat White', description: 'Silky microfoam over a double shot of espresso.', price: '$4.00' },
    { name: 'Macchiato', description: 'Espresso marked with a dollop of frothy steamed milk.', price: '$4.00' },
    { name: 'Mocha', description: 'Espresso, steamed milk, and rich chocolate syrup, topped with whipped cream.', price: '$4.00' },
    { name: 'Cold Brew', description: 'Smooth and refreshing cold-brewed coffee, served over ice.', price: '$4.00' }
  ];

  const specialtyLattes = [
    { name: 'Matcha Latte', description: 'Premium matcha powder blended with steamed milk.', price: '$4.50' },
    { name: 'Turmeric Latte', description: 'Turmeric, ginger, and cinnamon blended with steamed milk for a healthy, golden drink.', price: '$4.50' },
    { name: 'Chai Latte', description: 'Spiced chai tea blended with steamed milk.', price: '$4.00' },
    { name: 'Honey Lavender Latte', description: 'Espresso, steamed milk, honey, and a hint of lavender.', price: '$5.00' }
  ];

  const teaAndBeverages = [
    { name: 'Tea', description: 'Selection of black, green, and herbal teas.', price: '$3.00' },
    { name: 'Hot Chocolate', description: 'Rich and creamy hot chocolate, topped with whipped cream.', price: '$4.50' },
    { name: 'Golden Milk', description: 'Turmeric, ginger, and honey blended with steamed milk.', price: '$4.00' },
    { name: 'Iced Tea', description: 'Freshly brewed and chilled, served over ice.', price: '$5.00' }
  ];

  const pastries = [
    { name: 'Croissant', description: 'Buttery and flaky, baked fresh daily.', price: '$3.00' },
    { name: 'Muffins', description: 'Varieties: Blueberry, Chocolate Chip, Banana Nut.', price: '$2.50' },
    { name: 'Scones', description: 'Varieties: Cranberry Orange, Vanilla Bean.', price: '$4.00' },
    { name: 'Cookies', description: 'Varieties: Chocolate Chip, Oatmeal Raisin, Double Chocolate.', price: '$2.00' },
    { name: 'Brownies', description: 'Rich, fudgy chocolate brownies.', price: '$3.00' }
  ];

  return (
    <section className="bg-[#FAF1D7] px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-[#1C4D19] mb-12 lg:mb-16" style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
          Our Menu
        </h2>

        <div className="space-y-16 lg:space-y-24">
          {/* Coffee Section - Card Left, Image Right */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Coffee Menu Card */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 lg:p-12">
              <h3 className="text-[#1C4D19] mb-8" style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 600
              }}>
                Coffee
              </h3>
              <div className="space-y-6">
                {coffeeItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h4 className="text-[#1C4D19] font-semibold" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.name}
                      </h4>
                      <span className="text-[#1C4D19] font-semibold whitespace-nowrap" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[#1C4D19] opacity-70 pr-12" style={{
                        fontSize: 'clamp(0.875rem, 1.25vw, 0.9375rem)',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-line'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Coffee Image */}
            <div className="relative lg:order-last order-first">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={coffeeTopViewImage} 
                  alt="Latte with beautiful foam art" 
                  className="w-full h-full object-cover"
                  style={{ minHeight: '400px' }}
                />
                <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-full shadow-sm">
                  <span className="text-[#1C4D19] font-medium" style={{
                    fontSize: 'clamp(0.875rem, 1.25vw, 1rem)'
                  }}>
                    Latte
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialty Lattes Section - Image Left, Card Right */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Chai Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={image_9f32ff80f3517d38bfbee40687a98b292b5aaca0} 
                  alt="Chai Latte" 
                  className="w-full h-full object-cover"
                  style={{ minHeight: '350px' }}
                />
                <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-full shadow-sm">
                  <span className="text-[#1C4D19] font-medium" style={{
                    fontSize: 'clamp(0.875rem, 1.25vw, 1rem)'
                  }}>
                    Chai Latte
                  </span>
                </div>
              </div>
            </div>

            {/* Specialty Lattes Card */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 lg:p-12">
              <h3 className="text-[#1C4D19] mb-8" style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 600
              }}>
                Specialty Lattes
              </h3>
              <div className="space-y-6">
                {specialtyLattes.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h4 className="text-[#1C4D19] font-semibold" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.name}
                      </h4>
                      <span className="text-[#1C4D19] font-semibold whitespace-nowrap" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[#1C4D19] opacity-70 pr-12" style={{
                        fontSize: 'clamp(0.875rem, 1.25vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tea & Other Beverages and Hot Chocolate Image */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Tea & Beverages Section */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 lg:p-12">
              <h3 className="text-[#1C4D19] mb-8" style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 600
              }}>
                Tea & Other Beverages
              </h3>
              <div className="space-y-6">
                {teaAndBeverages.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h4 className="text-[#1C4D19] font-semibold" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.name}
                      </h4>
                      <span className="text-[#1C4D19] font-semibold whitespace-nowrap" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[#1C4D19] opacity-70 pr-12" style={{
                        fontSize: 'clamp(0.875rem, 1.25vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Chocolate Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={image_147ad856c195441782a9c05c868f4ee4aab0988a} 
                  alt="Hot Chocolate" 
                  className="w-full h-full object-cover"
                  style={{ minHeight: '350px' }}
                />
                <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-full shadow-sm">
                  <span className="text-[#1C4D19] font-medium" style={{
                    fontSize: 'clamp(0.875rem, 1.25vw, 1rem)'
                  }}>
                    Hot Chocolate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pastries Section - Image Left, No Card */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Croissant Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={image_521291f69eecd6e2bbb7794248fd6b486128ec63} 
                  alt="Croissant" 
                  className="w-full h-full object-cover"
                  style={{ minHeight: '350px' }}
                />
                <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-full shadow-sm">
                  <span className="text-[#1C4D19] font-medium" style={{
                    fontSize: 'clamp(0.875rem, 1.25vw, 1rem)'
                  }}>
                    Croissant
                  </span>
                </div>
              </div>
            </div>

            {/* Pastries Section */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 lg:p-12">
              <h3 className="text-[#1C4D19] mb-8" style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 600
              }}>
                Pastries & Baked Goods
              </h3>
              <div className="space-y-6">
                {pastries.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline gap-4 mb-1">
                      <h4 className="text-[#1C4D19] font-semibold" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.name}
                      </h4>
                      <span className="text-[#1C4D19] font-semibold whitespace-nowrap" style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)'
                      }}>
                        {item.price}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[#1C4D19] opacity-70 pr-12" style={{
                        fontSize: 'clamp(0.875rem, 1.25vw, 0.9375rem)',
                        lineHeight: '1.5'
                      }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}