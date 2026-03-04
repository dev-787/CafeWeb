import { Coffee, Smile, Heart, Leaf } from 'lucide-react';
import baristaImage from '../assets/Wj7gr7g3B7oONCaiJAc3UuqxH7k.jpg';
import cafeInterior from '../assets/979kSbT8wyB1UQtDccDksrCQc.jpg';
import matchaLatte from '../assets/vGTmFebYlkO9qE0VDnVl89qad4M.jpg';

export function AboutSection() {
  const features = [
    {
      icon: Coffee,
      title: "Great Coffee,",
      subtitle: "Tasty Sips"
    },
    {
      icon: Heart,
      title: "Warm, Cozy",
      subtitle: "Atmosphere"
    },
    {
      icon: Smile,
      title: "Speedy Service",
      subtitle: "with a Smile"
    },
    {
      icon: Leaf,
      title: "Local &",
      subtitle: "Sustainable"
    }
  ];

  return (
    <section className="bg-[#FAF1D7] px-6 lg:px-8 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8 lg:space-y-12">
            <div>
              <h2 className="text-[#1C4D19] mb-6" style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>
                Good Vibes.<br />Great Coffee.
              </h2>
              
              <p className="text-[#1C4D19] max-w-sm" style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: '1.6',
                opacity: 0.85
              }}>
                At Brewhaus, we serve great coffee and fresh pastries with care 
                and passion, creating a warm, cozy space that feels like home.
              </p>
            </div>

            {/* Features Grid with dividers */}
            <div className="grid grid-cols-2 gap-0">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center p-6 lg:p-8 border-[#1C4D19] border-opacity-15"
                  style={{
                    borderRight: index % 2 === 0 ? '1px solid rgba(28, 77, 25, 0.15)' : 'none',
                    borderBottom: index < 2 ? '1px solid rgba(28, 77, 25, 0.15)' : 'none'
                  }}
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-[#1C4D19] rounded-full flex items-center justify-center mb-3">
                    <feature.icon className="w-7 h-7 lg:w-8 lg:h-8 text-[#FAF1D7]" />
                  </div>
                  <h3 className="text-[#1C4D19]" style={{
                    fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                    fontWeight: 600,
                    lineHeight: '1.3'
                  }}>
                    {feature.title}<br />{feature.subtitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Images Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {/* Top Left - Barista Image */}
            <div className="col-span-1 row-span-2">
              <img 
                src={baristaImage} 
                alt="Barista making coffee" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            
            {/* Top Right - Cafe Interior */}
            <div className="col-span-1">
              <img 
                src={cafeInterior} 
                alt="Cozy cafe interior" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            
            {/* Bottom Right - Matcha Latte */}
            <div className="col-span-1">
              <img 
                src={matchaLatte} 
                alt="Matcha latte" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}