import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight, Sun, Cloud, Search, ShoppingBag, User, ChevronDown, Flower, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import dayBottle from '../assets/day-bottle.png'
import nightBottle from '../assets/night-bottle.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductSection from '../components/ProductSection'
import BenefitsSection from '../components/BenefitsSection'
import TreatsSection from '../components/TreatsSection'
import ReviewsSection from '../components/ReviewsSection'
import FaqSection from '../components/FaqSection'

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const { setCurrentPage, setSelectedProductId, products, setCartOpen, cart } = useStore()

  const [activeScentType, setActiveScentType] = useState('day') // 'day' | 'night'

  const [scentProfile, setScentProfile] = useState({
    family: 'Floral',
    wear: 'Daily',
    intensity: 'Subtle',
    season: 'Summer'
  })

  const heroRef = useRef(null)

  useEffect(() => {
    // GSAP Hero Entrance Timeline
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline()

      // Animate background large letters
      heroTl.fromTo(".hero-bg-text",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 0.85, duration: 1.8, ease: "power3.out" }
      )

      // Animate header nav items
      heroTl.fromTo(".hero-nav-item",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power2.out" },
        "-=1.4"
      )

      // Animate Perfume Bottle
      heroTl.fromTo(".hero-bottle-wrap",
        { scale: 0.85, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 1.8, ease: "elastic.out(1, 0.75)" },
        "-=1.0"
      )

      // Animate Bottom controls
      heroTl.fromTo(".hero-bottom-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=1.0"
      )

      // Unified scroll-based animations timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true
        }
      })

      // Scale down and adjust card container
      scrollTl.fromTo(".hero-card-container",
        {
          scale: 1,
          y: 0,
          borderRadius: window.innerWidth >= 768 ? "3.5rem" : "2.5rem"
        },
        {
          scale: 0.6,
          y: -20,
          borderRadius: window.innerWidth >= 768 ? "5rem" : "4rem",
          ease: "none",
          immediateRender: false
        },
        0
      )

      // Fade out header nav items inside the hero card on scroll (completes in first 30% of scroll)
      scrollTl.fromTo(".hero-nav-item",
        { opacity: 1, y: 0 },
        { opacity: 0, y: -15, duration: 0.1, ease: "none", immediateRender: false },
        0
      )

      // Fade out the large OVII background text (completes in first 40% of scroll)
      scrollTl.fromTo(".hero-bg-text",
        { opacity: 0.85, y: 0 },
        { opacity: 0, y: -40, duration: 0.1, ease: "none", immediateRender: false },
        0
      )

      // Fade out bottom controls (completes in first 30% of scroll)
      scrollTl.fromTo(".hero-bottom-item",
        { opacity: 1, y: 0 },
        { opacity: 0, y: 15, duration: 0.3, ease: "none", immediateRender: false },
        0
      )

      // Pull up scents section to close the scale-down gap
      scrollTl.fromTo("#scents",
        { y: 0 },
        {
          y: window.innerWidth >= 768 ? -220 : -140,
          ease: "none",
          immediateRender: false
        },
        0
      )

      // Scents Section Scroll-Triggered Entrance Animation
      const scentsTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scents",
          start: "top 85%", // starts when the top of the scents section reaches 85% of viewport height
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      scentsTl.fromTo(".scents-sub",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )

      scentsTl.fromTo(".scents-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.45"
      )

      scentsTl.fromTo(".scents-underline-path",
        { strokeDasharray: 120, strokeDashoffset: 120 },
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        "-=0.3"
      )

      scentsTl.fromTo(".scents-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.55"
      )

    }, heroRef)

    return () => ctx.revert() // Cleanup GSAP ScrollTriggers on unmount
  }, [])

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Handle Dynamic Bottle Swapping
  const getHeroBottleImage = () => {
    if (activeScentType === 'day') {
      return dayBottle
    } else {
      return nightBottle
    }
  }

  const handleShopOnline = () => {
    setCurrentPage('catalog')
  }

  const handleExploreClick = () => {
    document.getElementById('scents')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={heroRef} className="bg-[#FAF9F5] text-brand-charcoal font-sans overflow-hidden">

      {/* Scroll Trigger Wrapper */}
      <div id="hero-scroll-container" className="relative w-full">

        {/* 1. ROUNDED SAGE GREEN HERO SECTION BOX */}
        <section className="sticky top-0 z-10 bg-[#FAF9F5] p-4 md:p-6 w-full overflow-hidden select-none">
          <div
            className={`hero-card-container relative w-full min-h-[88vh] text-white p-6 md:p-12 flex flex-col justify-between overflow-hidden shadow-2xl select-none origin-center rounded-[2.5rem] md:rounded-[3.5rem] z-10 transition-colors duration-700 ease-in-out ${activeScentType === 'day' ? 'bg-[#8ea372]' : 'bg-[#204e4a]'
              }`}
          >

            {/* Abstract Background Atmospheric Glows */}
            <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-white/10 blur-[100px] pointer-events-none"></div>

            {/* A. Integrated Header (Navbar inside Card) */}
            <header className="flex justify-between items-center w-full relative z-20">
              {/* Left side Links (hidden on mobile, visible on desktop) */}
              <div className="hidden lg:flex items-center space-x-12 text-[14px] md:text-[15px] font-medium text-white font-sans uppercase tracking-[0.15em] hero-nav-item">
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-[#dbff37] transition-colors cursor-pointer">
                  Products
                </button>
                <button onClick={handleExploreClick} className="hover:text-[#dbff37] transition-colors cursor-pointer">
                  The Ritual
                </button>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-[#dbff37] transition-colors cursor-pointer">
                  Contact
                </button>
              </div>

              {/* Logo (Left-aligned on mobile, absolute center on desktop) */}
              <div className="flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 hero-nav-item">
                <button onClick={() => setCurrentPage('home')} className="flex items-center space-x-2 text-white hover:text-[#dbff37] transition-colors cursor-pointer">
                  {/* Sleek inline leaf/droplet logo - styled in white */}
                  <svg className="w-10 h-10 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-3.582-8-8 0-4.418 8-11 8-11s8 6.582 8 11c0 4.418-3.582 8-8 8z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a7 7 0 017 7" />
                  </svg>
                </button>
              </div>

              {/* Right side Elements */}
              <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 hero-nav-item ml-auto lg:ml-0">
                <button className="p-1.5 hover:text-[#dbff37] transition-colors hidden sm:block text-white cursor-pointer" aria-label="Search">
                  <Search className="w-[22px] h-[22px] stroke-[2.2]" />
                </button>
                <button className="p-1.5 hover:text-[#dbff37] transition-colors hidden sm:block text-white cursor-pointer" aria-label="User Profile">
                  <User className="w-[22px] h-[22px] stroke-[2.2]" />
                </button>
                <button onClick={() => setCartOpen(true)} className="relative p-1.5 hover:text-[#dbff37] transition-colors text-white cursor-pointer" aria-label="Shopping Cart">
                  <ShoppingBag className="w-[22px] h-[22px] stroke-[2.2]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#dbff37] text-brand-charcoal text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-xs font-sans">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleShopOnline}
                  className="bg-[#dbff37] hover:bg-white text-brand-charcoal px-8 py-3.5 md:px-9 md:py-4 rounded-full text-[13px] md:text-[14px] font-extrabold tracking-[0.1em] uppercase transition-all duration-300 shadow-sm cursor-pointer font-sans hidden lg:block"
                >
                  Shop Online
                </button>
                <button onClick={() => setCurrentPage('catalog')} className="lg:hidden w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-full bg-[#dbff37] hover:bg-white text-brand-charcoal flex items-center justify-center transition-colors cursor-pointer shadow-sm">
                  {/* Horizontal double bars hamburger icon */}
                  <div className="w-5 h-2.5 sm:w-5.5 sm:h-3 flex flex-col justify-between items-center">
                    <span className="w-full h-[2px] bg-brand-charcoal"></span>
                    <span className="w-full h-[2px] bg-brand-charcoal"></span>
                  </div>
                </button>
              </div>
            </header>

            {/* B. Center Layered Stage (OVII Text in center on mobile, top on desktop; Perfume Bottle at the bottom) */}
            <div className="absolute inset-0 flex flex-col justify-center md:justify-between items-center w-full select-none pointer-events-none z-0">

              {/* Massive background text */}
              <div className="relative w-full flex items-center justify-center pt-8 md:pt-[18vh] pointer-events-none select-none z-0 text-center">
                <h1 className="font-display font-black tracking-tight text-[22vw] text-white opacity-85 uppercase select-none leading-none text-center hero-bg-text">
                  OVII
                </h1>
              </div>

              {/* Perfume bottle container positioned at the bottom */}
              <div className="relative z-10 w-full max-w-[340px] md:max-w-[440px] aspect-square md:aspect-[4/5] flex flex-col items-center justify-center select-none mt-4 md:mt-0 pb-0 md:pb-[30vh] hero-bottle-wrap pointer-events-auto">
                <img
                  key={activeScentType}
                  src={getHeroBottleImage()}
                  alt={`${activeScentType === 'day' ? 'Day' : 'Night'} Perfume Bottle`}
                  className="h-[85%] md:h-[98%] object-contain animate-float animate-fade-in duration-700 filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                />
                {/* Soft ground shadow beneath bottle */}
                <div className="w-[50%] h-3 bg-black/25 rounded-full blur-md mt-2"></div>
              </div>
            </div>

            {/* C. Bottom Section (Explore Pill + Scent Toggle switcher) */}
            <div className="flex flex-row justify-between items-end w-full z-20 gap-3">
              {/* Bottom-left Pill link */}
              <button
                onClick={handleExploreClick}
                className="bg-white hover:scale-[1.02] text-brand-charcoal rounded-full pl-5 sm:pl-8 pr-2 sm:pr-3 py-2 sm:py-3 flex items-center space-x-3 sm:space-x-6 transition-all duration-300 shadow-md cursor-pointer font-sans hero-bottom-item"
              >
                <span className="text-[11px] sm:text-[13px] md:text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#1F1F1E] whitespace-nowrap">
                  Discover<span className="hidden sm:inline"> the Collection</span>
                </span>
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#dbff37] flex items-center justify-center text-brand-charcoal transition-transform duration-300 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                </span>
              </button>

              {/* Bottom-right Switcher toggle and decorative dot */}
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end space-y-1.5 z-20">
                  <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-[0.15em] text-white/80 animate-fade-in hero-bottom-item select-none pr-1.5">
                    {activeScentType === 'day' ? 'Day Ritual' : 'Night Ritual'}
                  </span>
                  <div className="bg-white p-1 rounded-full flex items-center shadow-md hero-bottom-item select-none">
                    <button
                      onClick={() => setActiveScentType('day')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeScentType === 'day'
                        ? 'bg-[#dbff37] text-brand-charcoal scale-105 shadow-xs'
                        : 'bg-transparent text-brand-charcoal/50 hover:text-brand-charcoal'
                        }`}
                      aria-label="Day Scent Ritual"
                    >
                      <Sun className="w-5 h-5 stroke-[2.2]" />
                    </button>
                    <button
                      onClick={() => setActiveScentType('night')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${activeScentType === 'night'
                        ? 'bg-[#dbff37] text-brand-charcoal scale-105 shadow-xs'
                        : 'bg-transparent text-brand-charcoal/50 hover:text-brand-charcoal'
                        }`}
                      aria-label="Night Scent Ritual"
                    >
                      <Cloud className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer: gap so content appears right when hero shrinks */}
        <div className="h-[15vh] pointer-events-none"></div>

      </div>

      {/* CONCIERGE SCENT FINDER - Integrated seamlessly on the same page background */}
      <section id="scents" className="relative z-20 pt-5 pb-10 px-6 md:px-8 bg-[#FAF9F5]">
        <div className="max-w-8xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <span className="scents-sub text-xs uppercase tracking-[0.3em] text-voldog-teal/70 font-extrabold font-voldog block">Virtual Consultation</span>
            <h2 className="scents-title font-voldog text-4xl md:text-5xl text-voldog-teal font-medium tracking-tight leading-[1.5] select-text">
              Discover your bespoke{" "}
              <span className="relative inline-block font-800 select-text">
                scent signature
                <svg className="absolute left-0 bottom-[-6px] w-full h-2.5 text-voldog-lime overflow-visible select-none pointer-events-none" viewBox="0 0 100 10" fill="none" preserveAspectRatio="none">
                  <path className="scents-underline-path" d="M2 5 C 30 2, 70 2, 98 5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          <div className="scents-card bg-white rounded-3xl p-6 pb-8 md:p-8 shadow-xl border border-voldog-teal/5 flex flex-col lg:flex-row justify-between items-center gap-6 max-w-7xl mx-auto font-voldog">
            {/* Scent Family */}
            <div className="flex-1 w-full px-5 py-3 border-b lg:border-b-0 lg:border-r border-voldog-teal/10 text-left relative group">
              <span className="text-[10px] uppercase tracking-wider text-voldog-teal/60 font-bold block mb-2">Scent Profile</span>
              <div className="relative w-full flex items-center justify-between">
                <select
                  value={scentProfile.family}
                  onChange={(e) => setScentProfile({ ...scentProfile, family: e.target.value })}
                  className="w-full bg-transparent text-voldog-teal text-[13px] md:text-sm font-extrabold outline-none cursor-pointer font-voldog appearance-none pr-8"
                >
                  <option value="Floral">Floral &amp; Sweet</option>
                  <option value="Woody">Woody &amp; Warm</option>
                  <option value="Citrus">Citrus &amp; Fresh</option>
                  <option value="Oriental">Oriental &amp; Oud</option>
                </select>
                <div className="absolute right-0 pointer-events-none text-voldog-teal/40 group-hover:text-voldog-teal transition-colors flex items-center">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Occasion */}
            <div className="flex-1 w-full px-5 py-3 border-b lg:border-b-0 lg:border-r border-voldog-teal/10 text-left relative group">
              <span className="text-[10px] uppercase tracking-wider text-voldog-teal/60 font-bold block mb-2">Ideal Setting</span>
              <div className="relative w-full flex items-center justify-between">
                <select
                  value={scentProfile.wear}
                  onChange={(e) => setScentProfile({ ...scentProfile, wear: e.target.value })}
                  className="w-full bg-transparent text-voldog-teal text-[13px] md:text-sm font-extrabold outline-none cursor-pointer font-voldog appearance-none pr-8"
                >
                  <option value="Daily">Daily Aura</option>
                  <option value="Evening">Evening Soirée</option>
                  <option value="Special">Formal &amp; Gallery</option>
                </select>
                <div className="absolute right-0 pointer-events-none text-voldog-teal/40 group-hover:text-voldog-teal transition-colors flex items-center">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Intensity */}
            <div className="flex-1 w-full px-5 py-3 border-b lg:border-b-0 lg:border-r border-voldog-teal/10 text-left relative group">
              <span className="text-[10px] uppercase tracking-wider text-voldog-teal/60 font-bold block mb-2">Scent Presence</span>
              <div className="relative w-full flex items-center justify-between">
                <select
                  value={scentProfile.intensity}
                  onChange={(e) => setScentProfile({ ...scentProfile, intensity: e.target.value })}
                  className="w-full bg-transparent text-voldog-teal text-[13px] md:text-sm font-extrabold outline-none cursor-pointer font-voldog appearance-none pr-8"
                >
                  <option value="Subtle">Skin Close</option>
                  <option value="Moderate">Moderate Radiance</option>
                  <option value="Intense">Bold Impression</option>
                </select>
                <div className="absolute right-0 pointer-events-none text-voldog-teal/40 group-hover:text-voldog-teal transition-colors flex items-center">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Season */}
            <div className="flex-1 w-full px-5 py-3 text-left relative group">
              <span className="text-[10px] uppercase tracking-wider text-voldog-teal/60 font-bold block mb-2">Season</span>
              <div className="relative w-full flex items-center justify-between">
                <select
                  value={scentProfile.season}
                  onChange={(e) => setScentProfile({ ...scentProfile, season: e.target.value })}
                  className="w-full bg-transparent text-voldog-teal text-[13px] md:text-sm font-extrabold outline-none cursor-pointer font-voldog appearance-none pr-8"
                >
                  <option value="Summer">Warm Weather</option>
                  <option value="Winter">Cold Weather</option>
                  <option value="All">All Season</option>
                </select>
                <div className="absolute right-0 pointer-events-none text-voldog-teal/40 group-hover:text-voldog-teal transition-colors flex items-center">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={() => setCurrentPage('catalog')}
              className="bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal font-black uppercase text-[12px] md:text-[13px] tracking-widest py-4 px-8 rounded-full flex items-center justify-center space-x-2.5 transition-all duration-350 cursor-pointer w-full lg:w-auto shrink-0 shadow-xs font-voldog"
            >
              <span>Consult Concierge</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT GRID SECTION - Rendered via external component */}
      <ProductSection />

      {/* 4. BENEFITS SECTION - Rendered via external component */}
      <BenefitsSection />

      {/* 5. TREATS CAROUSEL SECTION - Rendered via external component */}
      <TreatsSection />

      {/* 6. GOOGLE REVIEWS SECTION - Rendered via external component */}
      <ReviewsSection />

      {/* 7. FAQ ACCORDION SECTION - Rendered via external component */}
      <FaqSection />

    </div>
  )
}
