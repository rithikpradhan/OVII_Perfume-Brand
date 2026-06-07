import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import { PRODUCTS } from '../pages/Catalog'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Custom SVG Icons for the Switcher
const SolidIcon = () => (
  <svg className="w-4 h-4 mr-2 stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="14" r="7" />
    <path d="M7 7h10a1 1 0 0 1 1 1v1H6V8a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7V4" strokeLinecap="round" />
  </svg>
)

const MistIcon = () => (
  <svg className="w-4 h-4 mr-2 stroke-[2.2] fill-none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M7 10c0-2.5 1.5-3.5 3-3.5h4c1.5 0 3 1 3 3.5v9c0 1-1 2-2 2H9c-1 0-2-1-2-2v-9z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 6.5V4h4v2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="2" cy="7" r="0.5" fill="currentColor" />
    <circle cx="22" cy="7" r="0.5" fill="currentColor" />
  </svg>
)

export default function ProductSection() {
  const { setCurrentPage, setSelectedProductId, products } = useStore()
  const [filterType, setFilterType] = useState('solid') // 'solid' | 'mist'
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const productsTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      productsTl.fromTo(".products-doodle",
        { opacity: 0, scale: 0.6, rotate: -20 },
        { opacity: 1, scale: 1, rotate: -12, duration: 0.6, ease: "back.out(1.7)" }
      )

      productsTl.fromTo(".products-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )

      productsTl.fromTo(".products-switcher",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      )

      productsTl.fromTo(".products-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      )

      productsTl.fromTo(".product-card",
        { opacity: 0, y: 45 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.4"
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Filter and adapt products based on active toggle
  const displayProducts = (products.length > 0 ? products : PRODUCTS)
    .filter(p => p.isVisible !== false)
    .slice(0, 3)
    .map((p, idx) => {
      if (filterType === 'mist') {
        const mistNames = ["Jasmine Touch Liquid Mist", "Sandalwood Reverie Mist", "Oud Noir Cologne Mist"]
        const mistImages = [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600"
        ]
        return {
          ...p,
          name: mistNames[idx] || `${p.name} Mist`,
          price8g: Math.round(p.price8g * 1.25),
          price15g: Math.round(p.price15g * 1.25),
          image: mistImages[idx] || p.image,
          family: p.family
        }
      }
      return p
    })

  return (
    <section
      ref={sectionRef}
      id="products-section"
      className="relative z-20 py-24 px-6 md:px-12 bg-[#FAF9F5] border-t border-voldog-teal/5"
    >
      <div className="max-w-8xl mx-auto space-y-10">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="space-y-6 relative flex-1">

            {/* Orange ray whiskers doodle relative to the title container */}
            <div className="relative inline-block text-left w-full">

              <h2 className="products-title font-voldog text-4xl md:text-[52px] text-voldog-teal font-500 tracking-tight leading-[1.5] text-left select-text">
                Made with <span className="font-black">love</span>,<br />
                poured with <span className="font-black">care</span>!
              </h2>
            </div>

            {/* Solid vs Mist filter switcher pill exactly matching Voldog's shape */}
            <div className="products-switcher inline-flex bg-[#F0F2F1] p-1.5 rounded-full border border-voldog-teal/5 shadow-xs font-voldog select-none">
              <button
                onClick={() => setFilterType('solid')}
                className={`px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-extrabold flex items-center transition-all duration-300 cursor-pointer ${filterType === 'solid'
                  ? 'bg-voldog-lime text-voldog-teal shadow-xs scale-102'
                  : 'bg-transparent text-voldog-teal/50 hover:text-voldog-teal'
                  }`}
              >
                <SolidIcon />
                <span>Solid</span>
              </button>
              <button
                onClick={() => setFilterType('mist')}
                className={`px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-extrabold flex items-center transition-all duration-300 cursor-pointer ${filterType === 'mist'
                  ? 'bg-voldog-lime text-voldog-teal shadow-xs scale-102'
                  : 'bg-transparent text-voldog-teal/50 hover:text-voldog-teal'
                  }`}
              >
                <MistIcon />
                <span>Mist</span>
              </button>
            </div>
          </div>

          {/* Top-right description paragraph with yellow-lime dot */}
          <div className="products-desc max-w-sm text-left space-y-2 font-voldog md:pl-8 pb-1">
            <p className="text-sm md:text-[15px] text-voldog-teal/70 leading-relaxed font-semibold">
              Discover complete scent recipes for your skin or aura – ready to wear!
            </p>
          </div>
        </div>

        {/* Product Cards Grid with custom spacious look and floating drop shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProductId(product.id)
                setCurrentPage('product')
              }}
              className="product-card bg-[#F0F2F1] hover:bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-voldog-teal/5 flex flex-col transition-all duration-500 hover:scale-[1.02] cursor-pointer group relative"
            >
              {/* Product Image Stage — takes up most space */}
              <div className="w-full flex-1 flex items-center justify-center relative px-6 pt-8 pb-4" style={{minHeight: '220px'}}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[180px] object-contain transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-2 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)] relative z-10"
                />
                {/* Soft ground shadow underneath bottle */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[55%] h-2 bg-voldog-teal/10 rounded-full blur-xs transition-all duration-700 group-hover:scale-x-90 group-hover:opacity-60"></div>
              </div>

              {/* Product Info footer — always at bottom */}
              <div className="px-6 py-5 bg-white/60 group-hover:bg-white transition-colors duration-300 border-t border-voldog-teal/5">
                <span className="block text-[9px] uppercase tracking-widest font-black text-voldog-teal/40 mb-1">{product.family}</span>
                <h3 className="font-voldog text-lg md:text-xl font-bold text-voldog-teal group-hover:text-[#6E7E6A] transition-colors leading-snug">
                  {product.name}
                </h3>
                <span className="block text-sm md:text-[15px] font-semibold text-[#D0523C] mt-1">
                  ₹{product.price8g} – ₹{product.price15g}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
