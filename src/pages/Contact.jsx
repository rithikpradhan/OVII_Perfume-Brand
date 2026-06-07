import React, { useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { mockSupabase } from '../services/supabase'
import { useStore } from '../store'

export default function Contact() {
  const { setCurrentPage } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!termsAccepted) return
    setIsSubmitting(true)
    try {
      // Concatenate fields into message body for database compatibility
      const enrichedFormData = {
        name: formData.name,
        email: formData.email,
        message: `[Phone: ${formData.phone || 'N/A'}]\n\n${formData.message}`
      }
      await mockSupabase.submitContactForm(enrichedFormData)
      setIsSubmitting(false)
      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTermsAccepted(false)
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#FAF9F5] text-voldog-teal font-sans min-h-screen pb-24">
      
      {/* 1. HEADER SECTION (Cream background) */}
      <section className="bg-[#FAF9F5] pt-32 pb-16 px-6 md:px-12 select-none text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Centered Breadcrumbs */}
          <div className="flex justify-center items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-voldog-teal/40 font-voldog">
            <button onClick={() => setCurrentPage('home')} className="hover:text-voldog-teal cursor-pointer transition-colors">Home</button>
            <span>›</span>
            <span className="text-voldog-teal">Contact</span>
          </div>

          {/* Title */}
          <h1 className="font-voldog text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-voldog-teal uppercase tracking-tight leading-[1.3]">
            COMMUNICATION
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-voldog-teal/70 max-w-2xl mx-auto font-bold leading-[1.5] font-voldog">
            We are close to you and your scent journey!
          </p>

          {/* Scroll button */}
          <div className="pt-4">
            <button 
              onClick={() => document.getElementById('contact-details-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal font-black text-xs py-3.5 px-7 rounded-full flex items-center gap-3 transition-all cursor-pointer shadow-xs uppercase tracking-wider mx-auto"
            >
              <span>Contact us</span>
              <span className="w-5 h-5 rounded-full bg-white text-voldog-teal flex items-center justify-center">
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAP SECTION WITH WAVE OVERLAY */}
      <section className="relative w-full h-[380px] md:h-[480px] z-0 overflow-hidden bg-white">
        {/* Concave Wave overlay to cut the cream top into the map */}
        <div className="absolute top-0 left-0 right-0 w-full z-10 pointer-events-none">
          <svg 
            className="relative block w-full h-[45px] md:h-[75px]" 
            viewBox="0 0 1200 100" 
            preserveAspectRatio="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,20 Q600,80 1200,20 L1200,0 L0,0 Z" fill="#FAF9F5" />
          </svg>
          {/* Highlight circle in the center of the wave */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[12px] md:top-[30px] w-6 h-6 md:w-8 md:h-8 rounded-full bg-voldog-lime border-4 border-[#FAF9F5] pointer-events-auto shadow-xs"></div>
        </div>

        {/* Grayscale Styled Google Map iframe */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.482813137941!2d75.7872703!3d26.9205555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db3e232760f25%3A0x82f25413155d82f2!2sJaipur%2C%20Rajasthan%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="w-full h-full border-0 filter grayscale contrast-[1.1] opacity-90 relative z-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Atelier Map"
        ></iframe>
      </section>

      {/* 3. DETAILS & FORM SECTION */}
      <section id="contact-details-section" className="bg-white py-24 px-6 md:px-12 select-none relative z-10 text-left font-voldog text-voldog-teal border-b border-voldog-teal/5">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <h2 className="font-voldog text-3xl md:text-4xl font-black text-voldog-teal mb-10">
            Contact details:
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Address */}
              <div className="space-y-1">
                <span className="block text-[10px] text-voldog-teal/40 font-black tracking-widest uppercase">Address:</span>
                <p className="text-base font-bold text-voldog-teal leading-relaxed">
                  Jaipur, Rajasthan, India<br />
                  Boutique Scent Atelier
                </p>
              </div>

              {/* Orders & Info */}
              <div className="space-y-1">
                <span className="block text-[10px] text-voldog-teal/40 font-black tracking-widest uppercase">Orders & information:</span>
                <p className="text-base font-bold text-voldog-teal leading-relaxed">
                  Tel: +91 9404 797<br />
                  Email: concierge@ovii.in
                </p>
              </div>

              {/* Opening hours */}
              <div className="space-y-1">
                <span className="block text-[10px] text-voldog-teal/40 font-black tracking-widest uppercase">Opening hours:</span>
                <div className="text-sm font-bold text-voldog-teal/80 space-y-4 leading-relaxed">
                  <div>
                    <p className="text-voldog-teal font-black">Monday - Wednesday - Saturday:</p>
                    <p>09:00 - 15:00</p>
                  </div>
                  <div>
                    <p className="text-voldog-teal font-black">Tuesday - Thursday - Friday:</p>
                    <p>09:00 - 20:00</p>
                  </div>
                </div>
              </div>

              {/* Socials buttons */}
              <div className="space-y-4 pt-4">
                <a 
                  href="https://wa.me/919404797" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-xs font-black uppercase text-voldog-teal hover:text-brand-sage transition-all w-fit"
                >
                  <span className="w-8 h-8 rounded-full bg-[#E5ECE5] text-[#25D366] flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zM6.59 5.836c-.183-.406-.376-.414-.549-.422-.15-.006-.323-.007-.495-.007-.172 0-.45.064-.686.32-.236.256-.9.878-.9 2.142 0 1.265.92 2.486 1.049 2.656.128.172 1.81 2.763 4.384 3.87 2.138.92 2.573.737 3.033.695.46-.042 1.48-.605 1.693-1.19.213-.585.213-1.086.15-1.19-.063-.105-.236-.168-.495-.297-.258-.13-1.48-.73-1.706-.812-.227-.082-.39-.124-.555.124-.165.248-.64.812-.785.975-.145.165-.29.183-.549.055-.258-.13-1.09-.402-2.077-1.28-.767-.685-1.285-1.533-1.435-1.792-.15-.258-.016-.398.113-.527.116-.116.258-.302.387-.453.128-.15.172-.258.258-.43.087-.172.043-.323-.021-.453-.064-.13-.549-1.32-.753-1.81z" />
                    </svg>
                  </span>
                  <span>Whatsapp +91 9404 797</span>
                </a>
                
                <a 
                  href="https://instagram.com/ovii.perfume" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-xs font-black uppercase text-voldog-teal hover:text-brand-sage transition-all w-fit"
                >
                  <span className="w-8 h-8 rounded-full bg-[#E5ECE5] text-[#E1306C] flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </span>
                  <span>Instagram @ovii.perfume</span>
                </a>
              </div>

            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name field */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full name: *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors"
                  />
                </div>

                {/* Email field */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Email: *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors"
                  />
                </div>

                {/* Phone field */}
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Contact telephone number:"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors"
                  />
                </div>

                {/* Message field */}
                <div className="relative">
                  <textarea
                    required
                    rows="5"
                    placeholder="Your message: *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 resize-none transition-colors"
                  />
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3 text-xs text-voldog-teal/70 font-semibold leading-relaxed">
                  <input 
                    type="checkbox" 
                    required
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-voldog-teal/20 text-voldog-teal focus:ring-voldog-teal mt-0.5 cursor-pointer accent-voldog-lime"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    By submitting the above form I declare that I accept the Terms of Use & Privacy Policy of this website.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 relative">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal font-black text-xs py-3.5 px-8 rounded-full transition-all cursor-pointer shadow-xs uppercase tracking-wider min-w-[120px] text-center"
                  >
                    {isSubmitting ? 'Sending...' : 'Shipment'}
                  </button>
                </div>

                {/* Success Notification */}
                {isSuccess && (
                  <div className="flex items-center gap-2 text-voldog-teal text-xs py-3 px-5 bg-voldog-lime/20 rounded-full border border-voldog-lime/30 font-bold animate-fade-in mt-4">
                    <span>Message sent successfully! Our team will reply shortly.</span>
                  </div>
                )}

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BOTTOM BANNER CALLOUT */}
      <section className="bg-[#FAF9F5] py-20 px-6 md:px-12 select-none relative z-10 text-center font-voldog text-voldog-teal">
        <div className="max-w-4xl mx-auto space-y-2">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Do you want to learn more?
          </h3>
          <p className="text-3xl md:text-5xl font-black">
            Call us at: <a href="tel:+919404797" className="hover:text-brand-sage transition-colors text-voldog-teal">+91 9404 797</a>
          </p>
        </div>
      </section>

    </div>
  )
}
