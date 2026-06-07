import React, { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import perfumeBlendCta from '../assets/perfume-blend-cta.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Social Icons SVGs
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-4 h-4 stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export default function CtaBanner() {
  const { currentPage, setCurrentPage } = useStore()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      // Background image parallax scale
      ctaTl.fromTo(".cta-bg-img",
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 0.95, duration: 1.4, ease: "power2.out" }
      )

      // Title & CTA Button stagger
      ctaTl.fromTo(".cta-title",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=1.0"
      )

      ctaTl.fromTo(".cta-btn",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.7"
      )

      // Divider line drawing
      ctaTl.fromTo(".cta-divider",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.5"
      )

      // Footer columns stagger
      ctaTl.fromTo(".cta-footer-col",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
        "-=0.4"
      )

      // Copyright row
      ctaTl.fromTo(".cta-footer-bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.4"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [currentPage])

  return (
    <section
      ref={containerRef}
      id="cta-section"
      className="relative w-full h-auto pt-32 pb-12 bg-voldog-teal select-none z-20 overflow-hidden flex flex-col justify-end"
    >

      {/* Background Image Stage */}
      <img
        src={perfumeBlendCta}
        alt="Botanical perfume blending workspace background"
        className="cta-bg-img absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 origin-center"
      />

      {/* Ambient Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent z-0"></div>

      {/* Convex White Arch Overlay at the top edge */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="relative block w-full h-[55px] md:h-[105px]"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 L0,85 Q600,0 1200,85 L1200,0 Z" fill="#FAF9F5" />
        </svg>
      </div>

      {/* Content Area Container */}
      <div className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-12 flex flex-col items-center gap-12 pt-8 lg:pt-16">

        {/* Top CTA Row */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h2 className="cta-title font-voldog font-black text-white text-3xl md:text-[50px] leading-[1.5] tracking-tight max-w-2xl select-text text-left">
            You want to curate your custom<br />
            signature; We have all the notes!
          </h2>

          <button
            onClick={() => setCurrentPage('catalog')}
            className="cta-btn bg-voldog-lime hover:bg-white text-voldog-teal px-8 py-4.5 rounded-full text-xs md:text-sm font-extrabold tracking-wider uppercase transition-all duration-300 shadow-md flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <span>Blend your custom scent</span>
            <span className="w-7 h-7 rounded-full bg-white text-voldog-teal flex items-center justify-center transition-colors duration-350 group-hover:bg-voldog-lime">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </button>
        </div>

        {/* Horizontal thin divider line */}
        <div className="cta-divider w-full border-t border-white/25 origin-center"></div>

        {/* 4-Column Footer layout */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-left font-voldog z-10 pt-4 pb-4">

          {/* Column 1: Contact info */}
          <div className="cta-footer-col space-y-4">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs md:text-sm">Contact information</h4>
            <div className="text-white/60 text-xs md:text-sm space-y-2 font-medium">
              <p>75 Rue de l'Université, Paris, postal code 75007</p>
              <p>Contact Tel.: 210 9404797</p>
              <p>Email: info@oviiperfume.com</p>
            </div>

            {/* Circular Social Buttons */}
            <div className="flex gap-3 pt-2">
              <a
                href="#facebook"
                className="w-8 h-8 rounded-full bg-voldog-lime hover:bg-white text-voldog-teal flex items-center justify-center transition-colors duration-300 cursor-pointer"
                title="Follow us on Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="#instagram"
                className="w-8 h-8 rounded-full bg-voldog-lime hover:bg-white text-voldog-teal flex items-center justify-center transition-colors duration-300 cursor-pointer"
                title="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Our products */}
          <div className="cta-footer-col space-y-4">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs md:text-sm">Our products</h4>
            <div className="flex flex-col space-y-2 text-xs md:text-sm font-semibold">
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Solid Perfumes</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Liquid Mists</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Roll-on Aurals</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Travel Pouches</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Custom Blends</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Gift Sets</button>
            </div>
          </div>

          {/* Column 3: Customer service */}
          <div className="cta-footer-col space-y-4">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs md:text-sm">Customer service</h4>
            <div className="flex flex-col space-y-2 text-xs md:text-sm font-semibold">
              <button onClick={() => setCurrentPage('contact')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Contact Us</button>
              <button onClick={() => setCurrentPage('home')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Frequently Asked Questions</button>
              <button onClick={() => setCurrentPage('home')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Why Solid Fragrance?</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Shipping & Delivery</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Returns & Refund Policy</button>
              <button onClick={() => setCurrentPage('home')} className="text-white/60 hover:text-white transition-colors duration-300 cursor-pointer text-left w-fit">Payment Security</button>
            </div>
          </div>

          {/* Column 4: Opening hours */}
          <div className="cta-footer-col space-y-4">
            <h4 className="font-extrabold text-white uppercase tracking-wider text-xs md:text-sm">Opening hours</h4>
            <div className="text-white/60 text-xs md:text-sm space-y-3 font-medium">
              <div>
                <p className="text-white/40 uppercase tracking-wide text-[10px] font-bold">Monday – Wednesday – Saturday:</p>
                <p className="font-bold text-white/80 mt-0.5">09:00 – 15:00</p>
              </div>
              <div>
                <p className="text-white/40 uppercase tracking-wide text-[10px] font-bold">Tuesday – Thursday – Friday:</p>
                <p className="font-bold text-white/80 mt-0.5">09:00 – 20:00</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright block and payment icons */}
        <div className="cta-footer-bottom w-full border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-white/40 font-voldog select-none">
          <div className="text-center sm:text-left space-y-1 font-semibold">
            <p className="hover:text-white transition-colors cursor-pointer">Privacy Policy – Cookies Policy</p>
            <p>Copyright 2026 © All rights reserved. Created by: OVII Studio</p>
          </div>

          {/* Custom payment badges styled like the reference */}
          <div className="flex gap-2.5 items-center select-none font-bold">
            <span className="bg-white/10 border border-white/10 rounded-sm px-2 py-1 text-[8px] tracking-wider text-white/70 uppercase">Visa</span>
            <span className="bg-white/10 border border-white/10 rounded-sm px-2 py-1 text-[8px] tracking-wider text-white/70 uppercase">PayPal</span>
            <span className="bg-white/10 border border-white/10 rounded-sm px-2 py-1 text-[8px] tracking-wider text-white/70 uppercase">Discover</span>
            <span className="bg-white/10 border border-white/10 rounded-sm px-2 py-1 text-[8px] tracking-wider text-white/70 uppercase">Maestro</span>
            <span className="bg-white/10 border border-white/10 rounded-sm px-2 py-1 text-[8px] tracking-wider text-white/70 uppercase">MasterCard</span>
          </div>
        </div>

      </div>

    </section>
  )
}
