export function ReserveSection() {
  return (
    <section className="bg-[#FAF1D7] px-6 lg:px-12 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-[#1C4D19] text-center mb-6" style={{
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          Book a Table
        </h2>

        {/* Description */}
        <p className="text-[#1C4D19] text-center mb-12 lg:mb-16 max-w-3xl mx-auto opacity-80" style={{
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
          lineHeight: '1.6'
        }}>
          Reserve your table and indulge in exquisite flavors at Brewhaus, your haven of 
          coffee elegance. We can't wait to host your perfect coffee experience!
        </p>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-8 lg:p-12 overflow-visible">
            {/* Border with fade effect */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
              border: '2px solid #1C4D19',
              maskImage: 'linear-gradient(to bottom, black 0%, black 1%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 1%, transparent 100%)'
            }}></div>
            
            <form className="space-y-8 relative z-0">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Name Field */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-[#1C4D19] mb-3"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                      fontWeight: 500
                    }}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Smith"
                    className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] placeholder-[#1C4D19] placeholder-opacity-50 pb-3 focus:outline-none focus:border-[#1C4D19] transition-colors"
                    style={{
                      fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)'
                    }}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-[#1C4D19] mb-3"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                      fontWeight: 500
                    }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@mail.com"
                    className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] placeholder-[#1C4D19] placeholder-opacity-50 pb-3 focus:outline-none focus:border-[#1C4D19] transition-colors"
                    style={{
                      fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)'
                    }}
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label 
                  htmlFor="phone" 
                  className="block text-[#1C4D19] mb-3"
                  style={{
                    fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                    fontWeight: 500
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="(555) 123-4567"
                  className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] placeholder-[#1C4D19] placeholder-opacity-50 pb-3 focus:outline-none focus:border-[#1C4D19] transition-colors"
                  style={{
                    fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)'
                  }}
                />
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Date Field */}
                <div>
                  <label 
                    htmlFor="date" 
                    className="block text-[#1C4D19] mb-3"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                      fontWeight: 500
                    }}
                  >
                    Select Date *
                  </label>
                  <div className="relative">
                    <select
                      id="date"
                      className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] pb-3 pr-8 focus:outline-none focus:border-[#1C4D19] transition-colors appearance-none cursor-pointer"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
                        color: '#1C4D19',
                        opacity: 0.5
                      }}
                    >
                      <option value="" className="bg-[#FAF1D7] text-[#1C4D19] opacity-50">Select Your Date</option>
                      <option value="today" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">Today</option>
                      <option value="tomorrow" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">Tomorrow</option>
                      <option value="this-week" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">This Week</option>
                      <option value="next-week" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">Next Week</option>
                    </select>
                    <div className="absolute right-0 top-0 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-[#1C4D19]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Time Field */}
                <div>
                  <label 
                    htmlFor="time" 
                    className="block text-[#1C4D19] mb-3"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                      fontWeight: 500
                    }}
                  >
                    Select Time *
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] pb-3 pr-8 focus:outline-none focus:border-[#1C4D19] transition-colors appearance-none cursor-pointer"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
                        color: '#1C4D19',
                        opacity: 0.5
                      }}
                    >
                      <option value="" className="bg-[#FAF1D7] text-[#1C4D19] opacity-50">Select Your Time</option>
                      <option value="8am" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">8:00 AM</option>
                      <option value="9am" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">9:00 AM</option>
                      <option value="10am" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">10:00 AM</option>
                      <option value="11am" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">11:00 AM</option>
                      <option value="12pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">12:00 PM</option>
                      <option value="1pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">1:00 PM</option>
                      <option value="2pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">2:00 PM</option>
                      <option value="3pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">3:00 PM</option>
                      <option value="4pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">4:00 PM</option>
                      <option value="5pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">5:00 PM</option>
                      <option value="6pm" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">6:00 PM</option>
                    </select>
                    <div className="absolute right-0 top-0 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-[#1C4D19]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number of Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <label 
                    htmlFor="guests" 
                    className="block text-[#1C4D19] mb-3"
                    style={{
                      fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                      fontWeight: 500
                    }}
                  >
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <select
                      id="guests"
                      className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] pb-3 pr-8 focus:outline-none focus:border-[#1C4D19] transition-colors appearance-none cursor-pointer"
                      style={{
                        fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
                        color: '#1C4D19',
                        opacity: 0.5
                      }}
                    >
                      <option value="" className="bg-[#FAF1D7] text-[#1C4D19] opacity-50">Select Number of Guests</option>
                      <option value="1" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">1 Guest</option>
                      <option value="2" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">2 Guests</option>
                      <option value="3" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">3 Guests</option>
                      <option value="4" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">4 Guests</option>
                      <option value="5" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">5 Guests</option>
                      <option value="6" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">6 Guests</option>
                      <option value="7" className="bg-[#FAF1D7] text-[#1C4D19] opacity-100">7+ Guests</option>
                    </select>
                    <div className="absolute right-0 top-0 pointer-events-none">
                      <svg 
                        className="w-5 h-5 text-[#1C4D19]" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label 
                  htmlFor="requests" 
                  className="block text-[#1C4D19] mb-3"
                  style={{
                    fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                    fontWeight: 500
                  }}
                >
                  Special Requests
                </label>
                <textarea
                  id="requests"
                  rows="4"
                  placeholder="Tell us about any special requests or dietary requirements"
                  className="w-full bg-transparent border-b-2 border-[#1C4D19] text-[#1C4D19] placeholder-[#1C4D19] placeholder-opacity-50 pb-3 focus:outline-none focus:border-[#1C4D19] transition-colors resize-none"
                  style={{
                    fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)',
                    lineHeight: '1.6'
                  }}
                />
              </div>

              {/* Submit Button and Message */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                <button
                  type="submit"
                  className="px-12 py-4 border-2 border-[#1C4D19] rounded-full text-[#1C4D19] hover:bg-[#1C4D19] hover:text-[#FAF1D7] transition-all duration-300"
                  style={{
                    fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                    fontWeight: 600
                  }}
                >
                  Submit
                </button>
                <p className="text-[#1C4D19] opacity-70" style={{
                  fontSize: 'clamp(0.9375rem, 1.125vw, 1rem)'
                }}> Order will be served within 30 mins.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}