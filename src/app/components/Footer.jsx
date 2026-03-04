import { Phone, Mail, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  // shared classes/styles for navigation links
  const linkClasses = "text-[#F9E7B4] hover:text-[#FAF1D7] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2";
  const linkStyle = {
    fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
    fontWeight: 400 // slightly lighter for better hierarchy
  };

  return (
    <footer className="bg-[#1C4D19] text-[#F9E7B4] px-6 lg:px-12 py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 lg:mb-24">
          {/* Brand Section */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F9E7B4] rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#1C4D19] rounded-full"></div>
              </div>
            </div>
            
            {/* Tagline */}
            <div>
              <h3 className="text-[#F9E7B4]" style={{
                fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
                fontWeight: 700,
                lineHeight: '1.3'
              }}>
                Life Begins<br />After Coffee
              </h3>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:+12125550198" 
                className="flex items-center gap-2 text-[#F9E7B4] hover:text-[#FAF1D7] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                style={{
                  fontSize: 'clamp(0.875rem, 1vw, 0.9375rem)'
                }}
              >
                <Phone className="w-4 h-4" />
                <span>+1 (212) 555-0198</span>
              </a>
              
              <a 
                href="mailto:hello@brewhaus.com" 
                className="flex items-center gap-2 text-[#F9E7B4] hover:text-[#FAF1D7] transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                style={{
                  fontSize: 'clamp(0.875rem, 1vw, 0.9375rem)'
                }}
              >
                <Mail className="w-4 h-4" />
                <span>hello@brewhaus.com</span>
              </a>
            </div>
          </div>

          {/* Navigation Links - Column 1 */}
          <div className="space-y-4">
            {/* Section heading for accessibility/visual hierarchy */}
            <h4 className="text-[#F9E7B4]" style={{
              fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Main
            </h4>
            <nav className="flex flex-col gap-3">
              <a 
                href="#main" 
                className={linkClasses}
                style={linkStyle}
              >
                Home
              </a>
              <a 
                href="#menu" 
                className={linkClasses}
                style={linkStyle}
              >
                Menu
              </a>
              <a 
                href="#locations" 
                className={linkClasses}
                style={linkStyle}
              >
                Locations
              </a>
              <a 
                href="#about" 
                className={linkClasses}
                style={linkStyle}
              >
                About Us
              </a>
              <a 
                href="#news" 
                className={linkClasses}
                style={linkStyle}
              >
                News
              </a>
            </nav>
          </div>

          {/* Categories - Column 2 */}
          <div className="space-y-4">
            <h4 className="text-[#F9E7B4]" style={{
              fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
              fontWeight: 600, // slightly bolder to stand out from links
              marginBottom: '0.5rem'
            }}>
              Categories
            </h4>
            <nav className="flex flex-col gap-3">
              <a 
                href="#coffee" 
                className={linkClasses}
                style={linkStyle}
              >
                Coffee
              </a>
              <a 
                href="#cold-drinks" 
                className={linkClasses}
                style={linkStyle}
              >
                Cold Drinks
              </a>
              <a 
                href="#bakery" 
                className={linkClasses}
                style={linkStyle}
              >
                Bakery
              </a>
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-[#F9E7B4]" style={{
              fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9E7B4] rounded-full flex items-center justify-center text-[#1C4D19] hover:bg-[#FAF1D7] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9E7B4] rounded-full flex items-center justify-center text-[#1C4D19] hover:bg-[#FAF1D7] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#F9E7B4] rounded-full flex items-center justify-center text-[#1C4D19] hover:bg-[#FAF1D7] transition-colors"
                aria-label="Twitter"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Large Brand Name (decorative background) - bottom positioned */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none select-none z-0 pb-4 lg:pb-8">
        <h2
          aria-hidden="true"
          className="text-[#FAF1D7] opacity-20"
          style={{
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: '1'
          }}
        >
          Brewhaus
        </h2>
      </div>

      {/* Decorative Element - Top Right */}
      <div className="absolute top-8 right-8 w-16 h-16 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="50" r="45" stroke="#F9E7B4" strokeWidth="2" />
          <circle cx="50" cy="50" r="30" stroke="#F9E7B4" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" stroke="#F9E7B4" strokeWidth="2" />
        </svg>
      </div>
    </footer>
  );
}
