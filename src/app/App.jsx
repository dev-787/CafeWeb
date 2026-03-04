import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ReserveSection } from './components/ReserveSection';
import {Footer} from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1C4D19]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TestimonialsSection />
      <ReserveSection />
      <Footer />
    </div>
  );
}