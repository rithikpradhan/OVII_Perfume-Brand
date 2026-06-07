import React, { useState, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TreatsSection() {
  const { setCurrentPage, addToCart } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const carouselRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const treatsTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      // Heading elements
      treatsTl.fromTo(".treats-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )

      treatsTl.fromTo(".treats-arrow",
        { opacity: 0, scale: 0.5, rotate: -25 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )

      treatsTl.fromTo(".treats-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      )

      // Cards container entrance
      treatsTl.fromTo(".treats-card-item",
        { opacity: 0, x: 60 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.5"
      )

      // All products bottom button
      treatsTl.fromTo(".treats-all-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Draggable Carousel Mouse Event Handlers
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  const delicacies = [
    {
      id: 'jasmine-delicacy',
      name: 'Jasmine Delicacy',
      price: 149,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
      scent: 'Star Jasmine • White Musk',
      family: 'Floral'
    },
    {
      id: 'sandalwood-delicacy',
      name: 'Sandalwood Delicacy',
      price: 149,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
      scent: 'Mysore Sandalwood • Cedar',
      family: 'Woody'
    },
    {
      id: 'citrus-delicacy',
      name: 'Citrus Delicacy',
      price: 149,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
      scent: 'Bergamot • Lemon Zest',
      family: 'Fresh'
    },
    {
      id: 'oud-delicacy',
      name: 'Oud Delicacy',
      price: 149,
      image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
      scent: 'Dark Oud • Smoky Vetiver',
      family: 'Oriental'
    },
    {
      id: 'rose-delicacy',
      name: 'Rose Delicacy',
      price: 149,
      image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
      scent: 'Damask Rose • Soft Musk',
      family: 'Floral'
    }
  ]

  const handleAddToCart = (e, item) => {
    e.stopPropagation()
    const productObj = {
      id: item.id,
      name: item.name,
      scent: item.scent,
      image: item.image,
      family: item.family
    }
    addToCart(productObj, '10ml Rollerball', 1, item.price)
  }

  return (
    <section
      ref={containerRef}
      id="treats-section"
      className="relative z-20 py-24 bg-[#FAF9F5] border-t border-voldog-teal/5 overflow-hidden"
    >
      <div className="max-w-8xl mx-auto px-6 md:px-12 space-y-12 relative">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 relative">
          <h2 className="treats-title font-voldog text-4xl md:text-5xl text-voldog-teal font-extrabold tracking-tight leading-[1.5] select-text text-left max-w-lg">
            OR enjoyment continues<br />
            and after the ritual!
          </h2>

          <p className="treats-desc max-w-sm text-sm md:text-[15px] text-voldog-teal/70 leading-relaxed font-semibold text-left lg:pt-4">
            Choose between baked or refrigerated treats to give his diet that little something extra!
          </p>
        </div>

        {/* Draggable Carousel Container */}
        <div className="relative w-full">
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-8 py-8 px-4 no-scrollbar cursor-grab active:cursor-grabbing select-none scroll-smooth"
          >
            {delicacies.map((item) => (
              <div
                key={item.id}
                className="treats-card-item w-[280px] md:w-[320px] shrink-0 bg-[#F0F2F1] rounded-[2.5rem] p-8 flex flex-col justify-between relative min-h-[385px] border border-voldog-teal/5 transition-all duration-500 hover:scale-[1.02] hover:bg-white hover:shadow-md cursor-default group"
              >
                {/* Floating active/drag tag */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-voldog-lime text-voldog-teal font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-4 rounded-full shadow-xs opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 z-30 flex items-center gap-1.5">
                  <span>drag</span>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5a1 1 0 1 1-2 0V11a1 1 0 1 1 2 0zm0-5.5a1 1 0 1 1-2 0V9a1 1 0 1 1 2 0z" />
                  </svg>
                </div>

                {/* Packaging Pouch Image */}
                <div className="w-full aspect-[4/3] flex items-center justify-center relative mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[82%] object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] group-hover:scale-104 transition-transform duration-500 pointer-events-none"
                  />
                  {/* Soft ground shadow */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[55%] h-2.5 bg-voldog-teal/10 rounded-full blur-xs"></div>
                </div>

                {/* Delicacy details & Add to cart button */}
                <div className="w-full flex flex-col items-start text-left mt-auto">
                  <span className="block text-[10px] uppercase tracking-widest text-[#6E7E6A] font-extrabold mb-1">
                    {item.family}
                  </span>

                  <h3 className="font-voldog font-extrabold text-lg text-voldog-teal leading-snug">
                    {item.name}
                  </h3>

                  <span className="block text-sm font-semibold text-[#D0523C] mt-1">
                    ₹{item.price}.00
                  </span>

                  {/* Add to cart pill - Slides up on hover */}
                  <button
                    onClick={(e) => handleAddToCart(e, item)}
                    className="w-full bg-white hover:bg-voldog-lime text-voldog-teal font-extrabold text-[11px] uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-xs border border-voldog-teal/5 flex items-center justify-between transition-all duration-300 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 mt-4 cursor-pointer"
                  >
                    <span>Add to cart</span>
                    <span className="w-6 h-6 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center transition-colors group-hover:bg-white">
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Next / Slide Right Action circle on hover */}
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-[60%] -translate-y-1/2 w-12 h-12 rounded-full bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer z-30 hidden md:flex"
            title="Next Products"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* View All Collection centered bottom button */}
        <div className="treats-all-btn flex justify-center pt-8">
          <button
            onClick={() => setCurrentPage('catalog')}
            className="bg-[#F0F2F1] hover:bg-voldog-teal hover:text-white text-voldog-teal px-8 py-4 rounded-full text-[12px] md:text-[13px] font-extrabold tracking-wider uppercase transition-all duration-300 shadow-xs flex items-center gap-3 cursor-pointer group"
          >
            <span>All products</span>
            <span className="w-6 h-6 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}
