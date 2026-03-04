import coffeeCup from '../assets/NHPa5oGdDcM5WXBIDwyv46qTeE.png';

export function HeroSection() {
  return (
    <section className="relative px-6 lg:px-8 pt-8 lg:pt-16 pb-0">
      {/* Hero Content */}
      <div className="max-w-5xl mx-auto text-center mb-12 lg:mb-20">
        <h1 className="text-[#F9E7B4] mb-4 lg:mb-6" style={{
          fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          Life Begins<br />After Coffee
        </h1>
        
        <p className="text-[#F9E7B4] mb-8 lg:mb-10 px-4" style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.125rem)',
          opacity: 0.9
        }}>
          Because great coffee is the start of something even greater.
        </p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 px-4">
          <button className="w-full lg:w-auto px-8 py-3 bg-[#F9E7B4] text-[#1C4D19] rounded-full hover:opacity-90 transition-opacity" style={{
            fontSize: '1rem',
            fontWeight: 500
          }}>
            Explore Menu
          </button>
          <button className="w-full lg:w-auto px-8 py-3 border-2 border-[#F9E7B4] text-[#F9E7B4] rounded-full hover:bg-[#F9E7B4] hover:text-[#1C4D19] transition-all" style={{
            fontSize: '1rem',
            fontWeight: 500
          }}>
            Our Locations
          </button>
        </div>
      </div>
      
      {/* Coffee Cups - Single on mobile, Three on desktop */}
      <div className="relative max-w-6xl mx-auto -mb-1">
        {/* Mobile: Single Cup */}
        <div className="lg:hidden flex justify-center">
          <div className="relative w-72">
            <img 
              src={coffeeCup} 
              alt="Coffee Cup" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Desktop: Three Cups */}
        <div className="hidden lg:flex items-end justify-center gap-8">
          {/* Left Cup */}
          <div className="relative" style={{ 
            width: '280px',
            marginBottom: '20px'
          }}>
            <img 
              src={coffeeCup} 
              alt="Latte Coffee" 
              className="w-full h-auto"
              style={{
                transform: 'rotate(-8deg)'
              }}
            />
          </div>
          
          {/* Center Cup (Largest) */}
          <div className="relative" style={{ 
            width: '350px'
          }}>
            <img 
              src={coffeeCup} 
              alt="Espresso Coffee" 
              className="w-full h-auto"
            />
          </div>
          
          {/* Right Cup */}
          <div className="relative" style={{ 
            width: '280px',
            marginBottom: '20px'
          }}>
            <img 
              src={coffeeCup} 
              alt="Cappuccino Coffee" 
              className="w-full h-auto"
              style={{
                transform: 'rotate(8deg)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}