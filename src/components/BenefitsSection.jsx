import React, { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import solidPerfumeTin from '../assets/solid-perfume-tin.png'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Custom Botanical SVGs
const JasmineFlowerSVG = () => (
  <svg className="w-10 h-10 text-white filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.07)] fill-current" viewBox="0 0 100 100">
    <path d="M50 50 C50 30, 36 20, 50 10 C64 20, 50 30, 50 50 Z" />
    <path d="M50 50 C70 50, 80 36, 90 50 C80 64, 70 50, 50 50 Z" />
    <path d="M50 50 C50 70, 64 80, 50 90 C36 80, 50 70, 50 50 Z" />
    <path d="M50 50 C30 50, 20 64, 10 50 C20 36, 30 50, 50 50 Z" />
    <circle cx="50" cy="50" r="7" className="text-[#dbff37]" />
  </svg>
)

const SandalwoodShavingSVG = () => (
  <svg className="w-9 h-9 text-[#C8A274] filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.07)]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
    <path d="M20 50 Q 50 20 80 50 T 20 50" />
    <path d="M30 50 Q 50 35 70 50" strokeWidth="4" />
  </svg>
)

const GreenLeafSVG = () => (
  <svg className="w-8 h-8 text-[#7E9675] filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.06)] fill-current" viewBox="0 0 100 100">
    <path d="M15 85 C35 65 35 35 85 15 C65 35 35 35 15 85 Z" />
    <path d="M35 65 L60 40" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
)

const CitrusSliceSVG = () => (
  <svg className="w-11 h-11 text-[#dbff37] filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.08)]" viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="45" className="text-[#dbff37]/20" stroke="currentColor" strokeWidth="4.5" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M50 50 L50 15 A35 35 0 0 1 74.7 25.3 Z" />
    <path d="M50 50 L74.7 25.3 A35 35 0 0 1 85 50 Z" />
    <path d="M50 50 L85 50 A35 35 0 0 1 74.7 74.7 Z" />
    <path d="M50 50 L74.7 74.7 A35 35 0 0 1 50 85 Z" />
    <path d="M50 50 L50 85 A35 35 0 0 1 25.3 74.7 Z" />
    <path d="M50 50 L25.3 74.7 A35 35 0 0 1 15 50 Z" />
    <path d="M50 50 L15 50 A35 35 0 0 1 25.3 25.3 Z" />
    <path d="M50 50 L25.3 25.3 A35 35 0 0 1 50 15 Z" />
  </svg>
)

const CheckCircleIcon = () => (
  <span className="w-7 h-7 rounded-full bg-voldog-lime flex items-center justify-center shrink-0 shadow-xs text-voldog-teal">
    <svg className="w-4 h-4 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
)

export default function BenefitsSection() {
  const { setCurrentPage } = useStore()
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const benefitsTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      // Heading elements
      benefitsTl.fromTo(".benefits-title",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )

      benefitsTl.fromTo(".benefits-doodle",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )

      benefitsTl.fromTo(".benefits-desc",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )

      // Center stage (wave and centerpiece image)
      benefitsTl.fromTo(".benefits-wave-path",
        { strokeDasharray: 2200, strokeDashoffset: 2200 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
        "-=0.6"
      )

      benefitsTl.fromTo(".benefits-center-tin",
        { opacity: 0, scale: 0.7, rotate: -15 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.75)" },
        "-=0.9"
      )

      // Floating particles pop in
      benefitsTl.fromTo(".benefits-float-item",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" },
        "-=0.7"
      )

      // Cards staggered entries
      benefitsTl.fromTo(".benefit-card-left",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.7"
      )

      benefitsTl.fromTo(".benefit-card-right",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.7"
      )

      // Learn more button
      benefitsTl.fromTo(".benefits-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="benefits-section"
      className="relative z-20 py-24 px-6 md:px-12 bg-[#FAF9F5] border-t border-voldog-teal/5 overflow-hidden"
    >
      {/* Wavy path behind content (sweeps from top-left corner of section down to bottom-right corner, stretching full screen width) */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen pointer-events-none z-0 overflow-visible">
        <svg 
          className="w-full h-full text-voldog-lime opacity-85 overflow-visible" 
          viewBox="0 0 1000 1000" 
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            className="benefits-wave-path"
            d="M -100 -50 C 150 -30, 250 800, 500 600 C 700 450, 850 950, 1150 1100"
            stroke="currentColor"
            strokeWidth="110"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="max-w-8xl mx-auto space-y-16">

        {/* Title & Loop Doodle */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="benefits-title font-voldog text-4xl md:text-5xl text-voldog-teal font-500 tracking-tight leading-[1.5] select-text">
            Why <span className="font-black">OVII</span>? Scent benefits<br />
            they talk from alone their!
          </h2>

          {/* Handdrawn looped scribble SVG line */}
          <div className="flex justify-center">
            <svg
              className="benefits-doodle w-36 h-10 text-[#E26953] pointer-events-none select-none"
              viewBox="0 0 100 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
            >
              <path d="M10 12 C 25 12, 35 4, 48 12 C 60 20, 70 12, 90 12" />
            </svg>
          </div>

          {/* Paragraph */}
          <div className="benefits-desc space-y-4 pt-2">
            <p className="text-sm md:text-base text-voldog-teal/70 leading-relaxed font-semibold max-w-xl mx-auto">
              The OVII solid perfume collection provides numerous benefits for the skin and sensory well-being. From the moment you apply the rich wax signature, the aromatic changes are immediately visible and its soothing, intimate aura unfolds.
            </p>
          </div>
        </div>

        {/* Centerpiece & Float Stage (Responsive Staggered absolute layout on desktop, stacked on mobile) */}
        <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:block pt-8 lg:pt-0 min-h-[500px] lg:h-[650px]">

          {/* Card 1: Top Left - Absolute positioned on desktop, stacked on mobile */}
          <div className="benefit-card-left bg-white rounded-[1.5rem] p-5 shadow-[0_10px_35px_rgba(32,78,74,0.04)] border border-voldog-teal/5 flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_45px_rgba(32,78,74,0.08)] cursor-default select-none relative group z-20 mb-6 lg:mb-0 lg:absolute lg:top-[12%] lg:left-[2%] xl:left-[8%] w-full lg:w-[320px]">
            <CheckCircleIcon />
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-voldog-teal">Intimate scent bubble</h4>
              <p className="text-xs text-voldog-teal/70 font-semibold mt-0.5 leading-normal">Stays close to the skin without overpowering the room</p>
            </div>
          </div>

          {/* Card 2: Bottom Left - Absolute positioned on desktop, stacked on mobile */}
          <div className="benefit-card-left bg-white rounded-[1.5rem] p-5 shadow-[0_10px_35px_rgba(32,78,74,0.04)] border border-voldog-teal/5 flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_45px_rgba(32,78,74,0.08)] cursor-default select-none relative group z-20 mb-6 lg:mb-0 lg:absolute lg:bottom-[10%] lg:left-[5%] xl:left-[10%] w-full lg:w-[320px]">
            <CheckCircleIcon />
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-voldog-teal">Alcohol-free formula</h4>
              <p className="text-xs text-voldog-teal/70 font-semibold mt-0.5 leading-normal">Nourishes the skin using organic waxes and oils</p>
            </div>
          </div>

          {/* Center Image Component - Floating Tin centered absolutely on desktop */}
          <div className="benefits-center-tin relative lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full max-w-[350px] mx-auto lg:mx-0 h-[350px] flex items-center justify-center py-8 lg:py-0 z-10 select-none mb-6 lg:mb-0">
            
            {/* Floating Particles (Surrounding botanical elements relative to tin) */}
            <div className="benefits-float-item absolute top-[12%] left-[10%] z-20 animate-float" style={{ animationDuration: '7.5s' }}>
              <JasmineFlowerSVG />
            </div>
            
            <div className="benefits-float-item absolute top-[8%] right-[8%] z-20 animate-float" style={{ animationDuration: '9s' }}>
              <SandalwoodShavingSVG />
            </div>

            <div className="benefits-float-item absolute bottom-[14%] left-[6%] z-20 animate-float" style={{ animationDuration: '8s' }}>
              <GreenLeafSVG />
            </div>

            <div className="benefits-float-item absolute bottom-[10%] right-[10%] z-20 animate-float" style={{ animationDuration: '10s' }}>
              <CitrusSliceSVG />
            </div>

            {/* Central Open Tin */}
            <div className="relative flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-xs">
              <img
                src={solidPerfumeTin}
                alt="Open solid perfume gold tin centerpiece"
                className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] object-contain relative z-10 filter drop-shadow-[0_20px_40px_rgba(32,78,74,0.12)] transition-transform duration-700 hover:scale-[1.02] hover:-rotate-3"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-3.5 bg-voldog-teal/15 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Card 3: Top Right - Absolute positioned on desktop, stacked on mobile */}
          <div className="benefit-card-right bg-white rounded-[1.5rem] p-5 shadow-[0_10px_35px_rgba(32,78,74,0.04)] border border-voldog-teal/5 flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_45px_rgba(32,78,74,0.08)] cursor-default select-none relative group z-20 mb-6 lg:mb-0 lg:absolute lg:top-[28%] lg:right-[2%] xl:right-[8%] w-full lg:w-[320px]">
            <CheckCircleIcon />
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-voldog-teal">Longer-lasting aura</h4>
              <p className="text-xs text-voldog-teal/70 font-semibold mt-0.5 leading-normal">Slow-evaporating wax base retains fragrance for hours</p>
            </div>
          </div>

          {/* Card 4: Bottom Right - Absolute positioned on desktop, stacked on mobile */}
          <div className="benefit-card-right bg-white rounded-[1.5rem] p-5 shadow-[0_10px_35px_rgba(32,78,74,0.04)] border border-voldog-teal/5 flex items-start gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_45px_rgba(32,78,74,0.08)] cursor-default select-none relative group z-20 lg:absolute lg:bottom-[5%] lg:right-[8%] xl:right-[12%] w-full lg:w-[320px]">
            <CheckCircleIcon />
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-voldog-teal">Travel-friendly design</h4>
              <p className="text-xs text-voldog-teal/70 font-semibold mt-0.5 leading-normal">Leak-proof, compact tin fits easily in pocket or bag</p>
            </div>
          </div>

        </div>

        {/* Learn More Bottom Pill Button */}
        <div className="benefits-btn flex justify-center pt-8">
          <button
            onClick={() => setCurrentPage('catalog')}
            className="bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal px-8 py-4 rounded-full text-[13px] md:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 shadow-md flex items-center gap-3 cursor-pointer group"
          >
            <span>Learn more about OVII</span>
            <span className="w-7 h-7 rounded-full bg-white text-voldog-teal flex items-center justify-center transition-all duration-300 group-hover:bg-voldog-lime group-hover:text-voldog-teal">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}
