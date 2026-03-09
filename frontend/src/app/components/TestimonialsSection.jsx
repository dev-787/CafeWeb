import milkPouringImage from '../assets/M1JkuM3cwLfW85P9veFMxRmaU8.jpg';
import icedCoffeeImage from '../assets/PfqwIxfvIyrvSGs5aoSIk469Ec.jpg';
import latteArtImage from '../assets/xkzPxQRZ8YIIdyL6tfb8JVXc7SU.jpg';

export function TestimonialsSection() {
  const testimonials = [
    {
      text: "Brewhaus has spoiled other coffee shops for me — in the best way. Great espresso, fresh pastries, and a team that makes you feel like a regular from day one.hahhahhahahhah hhahahahah",
      author: "Patrick M.",
      role: "Espresso lover"
    },
    {
      text: "I stop by every morning before work, and it's the best part of my day. The iced latte is my go-to, but I've honestly never had a bad drink here. Everything tastes handcrafted and full of care.",
      author: "Sofia R.",
      role: "Coffee fan"
    },
    {
      text: "Always a warm, welcoming vibe — perfect for a quick coffee or a quiet read. The banana bread? Totally addictive.",
      author: "Jordan T.",
      role: "Iced latte addict"
    }
  ];

  return (
    <section className="bg-[#FAF1D7] px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-[#1C4D19] text-center mb-12 lg:mb-16" style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          What People<br />Love About Us
        </h2>

        {/* Masonry Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            {/* Testimonial Card 1 */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 shadow-sm">
              <div className="text-[#1C4D19] mb-4" style={{
                fontSize: '2.5rem',
                fontWeight: 400,
                lineHeight: '1'
              }}>
                "
              </div>
              <p className="text-[#1C4D19] mb-6" style={{
                fontSize: 'clamp(0.9375rem, 1.25vw, 1rem)',
                lineHeight: '1.6',
                fontWeight: 500
              }}>
                {testimonials[0].text}
              </p>
              <p className="text-[#1C4D19] opacity-70" style={{
                fontSize: 'clamp(0.875rem, 1.125vw, 0.9375rem)',
                fontWeight: 400
              }}>
                {testimonials[0].author} – {testimonials[0].role}
              </p>
            </div>

            {/* Image 1 */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={milkPouringImage}
                alt="Pouring milk into espresso"
                className="w-full h-full object-cover"
                style={{ minHeight: '350px', maxHeight: '450px' }}
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            {/* Image 2 */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={icedCoffeeImage}
                alt="Iced coffee being poured"
                className="w-full h-full object-cover"
                style={{ minHeight: '400px', maxHeight: '500px' }}
              />
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 shadow-sm">
              <div className="text-[#1C4D19] mb-4" style={{
                fontSize: '2.5rem',
                fontWeight: 400,
                lineHeight: '1'
              }}>
                "
              </div>
              <p className="text-[#1C4D19] mb-6" style={{
                fontSize: 'clamp(0.9375rem, 1.25vw, 1rem)',
                lineHeight: '1.6',
                fontWeight: 500
              }}>
                {testimonials[2].text}
              </p>
              <p className="text-[#1C4D19] opacity-70" style={{
                fontSize: 'clamp(0.875rem, 1.125vw, 0.9375rem)',
                fontWeight: 400
              }}>
                {testimonials[2].author} – {testimonials[2].role}
              </p>
            </div>
          </div>

          {/* Third Column */}
          <div className="space-y-6">
            {/* Testimonial Card 3 */}
            <div className="bg-[#F9E7B4] rounded-3xl p-8 shadow-sm">
              <div className="text-[#1C4D19] mb-4" style={{
                fontSize: '2.5rem',
                fontWeight: 400,
                lineHeight: '1'
              }}>
                "
              </div>
              <p className="text-[#1C4D19] mb-6" style={{
                fontSize: 'clamp(0.9375rem, 1.25vw, 1rem)',
                lineHeight: '1.6',
                fontWeight: 500
              }}>
                {testimonials[1].text}
              </p>
              <p className="text-[#1C4D19] opacity-70" style={{
                fontSize: 'clamp(0.875rem, 1.125vw, 0.9375rem)',
                fontWeight: 400
              }}>
                {testimonials[1].author} – {testimonials[1].role}
              </p>
            </div>

            {/* Image 3 */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img 
                src={latteArtImage}
                style={{ objectFit: 'cover', width: '100%', height: '100%', minHeight: '350px', maxHeight: '450px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}