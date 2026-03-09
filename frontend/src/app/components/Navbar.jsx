import { Menu } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between lg:justify-center lg:gap-12 px-6 lg:px-8 py-6 text-[#F9E7B4]">
      {/* Mobile Left Menu */}
      <button className="lg:hidden w-12 h-12 bg-[#F9E7B4] rounded-full flex items-center justify-center">
        <Menu className="w-6 h-6 text-[#1C4D19]" />
      </button>
      
      {/* Desktop Nav Links - Left */}
      <a href="#menu" className="hidden lg:block hover:opacity-80 transition-opacity">
        Menu
      </a>
      <a href="#locations" className="hidden lg:block hover:opacity-80 transition-opacity">
        Locations
      </a>
      
      {/* Logo - Center on mobile, in nav on desktop */}
      <div className="w-12 h-12 bg-[#F9E7B4] rounded-full flex items-center justify-center">
        <div className="w-6 h-3 bg-[#1C4D19] rounded-full"></div>
      </div>
      
      {/* Desktop Nav Links - Right */}
      <a href="#about" className="hidden lg:block hover:opacity-80 transition-opacity">
        About Us
      </a>
      <a href="#news" className="hidden lg:block hover:opacity-80 transition-opacity">
        News
      </a>
      
      {/* Mobile Right Menu */}
      <button className="lg:hidden w-12 h-12 bg-[#F9E7B4] rounded-full flex items-center justify-center">
        <Menu className="w-6 h-6 text-[#1C4D19]" />
      </button>
    </nav>
  );
}
