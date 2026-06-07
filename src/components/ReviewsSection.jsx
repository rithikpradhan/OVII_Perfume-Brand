import React, { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Multi-color Google G Logo SVG
const GoogleGIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export default function ReviewsSection() {
  const containerRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scrolling Text on Path Animation
      gsap.to("#textPathScroll", {
        attr: { startOffset: "100%" },
        duration: 25,
        ease: "none",
        repeat: -1
      })

      // 2. Entrance Timelines
      const reviewsTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      reviewsTl.fromTo(".rev-sub",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )

      reviewsTl.fromTo(".rev-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )

      reviewsTl.fromTo(".rev-doodle",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      )

      reviewsTl.fromTo(".rev-wave-svg",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        "-=0.8"
      )

      reviewsTl.fromTo(".rev-card-item",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
        "-=0.5"
      )

      reviewsTl.fromTo(".rev-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  const reviews = [
    {
      name: "Erietta Raftopoulou",
      date: "a month ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      rating: 5,
      text: "The concierge consultation was excellent! They walked me through all the scent profiles, and now I am enjoying my Jasmine Touch solid perfume daily. Truly premium. 🫶"
    },
    {
      name: "From Kurtellen",
      date: "6 months ago",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      rating: 5,
      text: "The best fragrance experience you can find! Long lasting, skin-friendly, and very convenient for travel. Over 2 years of being a satisfied customer."
    },
    {
      name: "Avi nApps (avinapps)",
      date: "8 months ago",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
      rating: 5,
      text: "Fantastic team, very understanding and extremely knowledgeable about the botanical notes. I absolutely love my Sandalwood Reverie. A clean solid choice!"
    }
  ]

  return (
    <section
      ref={containerRef}
      id="reviews-section"
      className="relative z-20 py-24 bg-[#FAF9F5] border-t border-voldog-teal/5 overflow-hidden"
    >
      {/* Curved marquee path behind text (absolute back layer stretching full screen width) */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-screen h-[420px] pointer-events-none z-0 overflow-visible">
        <svg
          className="rev-wave-svg w-full h-full text-voldog-lime overflow-visible opacity-90"
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Thick winding yellow-lime stroke path - steeper and wider spanning edge-to-edge */}
          <path
            id="reviewWavePath"
            d="M -100 -50 C 150 150, 300 430, 500 380 C 700 330, 800 100, 1100 120"
            stroke="currentColor"
            strokeWidth="85"
            strokeLinecap="round"
            fill="none"
          />

          {/* White repeating text scrolling along the curve */}
          <text className="fill-white font-voldog font-black uppercase text-[15px] md:text-[17px] tracking-[0.15em] font-extrabold select-none">
            <textPath href="#reviewWavePath" startOffset="0%" id="textPathScroll" dy="6px">
              * OVII * BESPOKE SCENT SIGNATURE * OVII * BESPOKE SCENT SIGNATURE * OVII * BESPOKE SCENT SIGNATURE * OVII * BESPOKE SCENT SIGNATURE * OVII * BESPOKE SCENT SIGNATURE * OVII * BESPOKE SCENT SIGNATURE *
            </textPath>
          </text>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">

        {/* Title Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto relative z-20">
          <div className="flex justify-center">
            <span className="rev-sub text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest text-voldog-teal bg-white py-2 px-6 rounded-full border border-voldog-teal/5 shadow-[0_5px_15px_rgba(32,78,74,0.03)] font-voldog">
              Customer Reviews
            </span>
          </div>

          <div className="relative inline-block text-center pt-2">
            <h2 className="rev-title font-voldog text-3xl md:text-5xl text-voldog-teal font-extrabold tracking-tight leading-[1.5] select-text">
              Aromas where they wore<br />
              with joy – customers<br />
              where they spoke with love!
            </h2>

            {/* Green dot positioned between the first and second line of the heading */}
            <div className="absolute left-[50%] top-[33%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-voldog-lime z-10"></div>


          </div>
        </div>

        {/* Carousel Slider with generous vertical gap separating from header */}
        <div className="relative w-full max-w-5xl mx-auto px-4 md:px-12 flex items-center z-20 mt-16 md:mt-24 pt-8">

          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 md:left-4 z-30 w-10 h-10 rounded-full border border-voldog-teal/10 bg-white hover:bg-voldog-lime hover:text-voldog-teal transition-all items-center justify-center cursor-pointer shadow-xs text-voldog-teal hidden md:flex"
            title="Previous Reviews"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Draggable/Scrollable cards container */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-6 py-6 px-2 no-scrollbar w-full scroll-smooth select-none"
          >
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="rev-card-item w-[295px] md:w-[320px] shrink-0 bg-white rounded-[2rem] p-7 shadow-[0_12px_40px_rgba(32,78,74,0.03)] border border-voldog-teal/5 flex flex-col justify-between min-h-[270px] relative hover:scale-[1.02] transition-transform duration-300"
              >
                {/* Top User block */}
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border border-voldog-teal/5"
                      draggable="false"
                    />
                    <div className="text-left">
                      <h4 className="text-sm font-extrabold text-voldog-teal font-voldog leading-tight">{rev.name}</h4>
                      <span className="text-[10px] text-voldog-teal/50 font-bold font-voldog">{rev.date}</span>
                    </div>
                  </div>

                  {/* Google Logo Icon */}
                  <GoogleGIcon />
                </div>

                {/* Rating & Review Paragraph */}
                <div className="w-full text-left space-y-3 mt-4">
                  {/* 5 Stars Rating */}
                  <div className="flex gap-1 text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                  </div>

                  <p className="text-xs md:text-sm text-voldog-teal/85 font-semibold leading-relaxed font-voldog">
                    {rev.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-2 md:right-4 z-30 w-10 h-10 rounded-full border border-voldog-teal/10 bg-white hover:bg-voldog-lime hover:text-voldog-teal transition-all items-center justify-center cursor-pointer shadow-xs text-voldog-teal hidden md:flex"
            title="Next Reviews"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Google Ratings summary block at bottom */}
        <div className="rev-footer text-center space-y-1 z-20 relative pt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="font-voldog font-black text-2xl text-voldog-teal leading-none">4.8</span>
            <div className="flex gap-0.5 text-amber-400 text-lg">
              {"★".repeat(5)}
            </div>
          </div>
          <p className="text-[11px] md:text-xs text-voldog-teal/60 font-extrabold font-voldog">Based on 570 reviews</p>

          {/* Powered by Google colored letters */}
          <div className="text-[11px] md:text-xs text-voldog-teal/60 font-extrabold font-voldog flex items-center justify-center gap-1.5 mt-1 select-none">
            <span>powered by</span>
            <span className="font-black tracking-tight text-sm">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
