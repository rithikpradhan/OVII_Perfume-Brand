import React, { useState, useEffect, useRef } from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function FaqSection() {
  const { setCurrentPage } = useStore()
  const [openIdx, setOpenIdx] = useState(null)

  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const faqTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      })

      // Left column entrance
      faqTl.fromTo(".faq-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )

      faqTl.fromTo(".faq-underline-path",
        { strokeDasharray: 120, strokeDashoffset: 120 },
        { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" },
        "-=0.4"
      )

      faqTl.fromTo(".faq-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )

      faqTl.fromTo(".faq-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )

      // Right column accordion items staggered entrance
      faqTl.fromTo(".faq-item",
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
        "-=0.8"
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const faqItems = [
    {
      question: "What is solid perfume?",
      answer: "Solid perfume is a wax-based fragrance that is applied directly to the skin. It uses natural ingredients like beeswax or jojoba oil rather than alcohol as a carrier, providing an intimate, long-lasting scent."
    },
    {
      question: "Why should I choose solid perfume over liquid spray?",
      answer: "Liquid sprays rely on quick-evaporating alcohol that disperses far, whereas solid perfumes meld with your body heat to create a personal, subtle scent bubble. They are also 100% spill-proof and travel-friendly."
    },
    {
      question: "What are the main skin benefits of your botanical base?",
      answer: "Our formulations use nourishing candelilla wax, organic shea butter, and pure essential oils. They are free from drying alcohols, making them exceptionally hydrating and gentle on sensitive skin."
    },
    {
      question: "Does solid perfume contain synthetic preservatives or alcohol?",
      answer: "No, all OVII products are 100% alcohol-free and do not contain chemical phthalates, parabens, or synthetic preservatives. We preserve our formulas using natural antioxidants like Vitamin E."
    },
    {
      question: "How should I store solid perfumes correctly?",
      answer: "Store your tin in a cool, dry place away from direct sunlight. While solid wax has a high melting threshold, keeping it out of extreme heat (like hot cars) ensures the fragrance notes remain perfectly preserved."
    },
    {
      question: "How long does a tin of solid perfume last?",
      answer: "A single 15g tin typically lasts between 3 to 6 months of daily application. Since you only need to dab a small amount onto pulse points, a little goes a very long way."
    }
  ]

  return (
    <section
      ref={containerRef}
      id="faq-section"
      className="relative z-20 py-24 px-6 md:px-12 bg-[#FAF9F5] border-t border-voldog-teal/5"
    >
      <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* Left Column (Heading & Info) */}
        <div className="lg:col-span-5 flex flex-col justify-start text-left space-y-8 lg:sticky lg:top-28 lg:h-fit">
          <h2 className="faq-title font-voldog text-3xl md:text-4xl text-voldog-teal font-extrabold tracking-tight leading-[1.5] select-text">
            Do you have Questions?<br />
            We have<br />

            {/* Underlined word with drawing SVG path */}
            <span className="relative inline-block mt-1">
              the answers!
              <svg
                className="absolute left-0 bottom-[-8px] w-full h-3 text-voldog-lime overflow-visible select-none pointer-events-none"
                viewBox="0 0 100 10"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  className="faq-underline-path"
                  d="M2 5 C 30 2, 70 2, 98 5"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="faq-desc text-sm md:text-[15px] text-voldog-teal/70 leading-relaxed font-semibold">
            Everything you need to know about OVII solid perfumes, our botanical formulations, and how to apply them. We're here to make your scent transition easy.
          </p>

          <div className="faq-btn pt-6">
            <button
              onClick={() => setCurrentPage('contact')}
              className="bg-[#F0F2F1] hover:bg-voldog-teal hover:text-white text-voldog-teal px-8 py-4 rounded-full text-[12px] md:text-[13px] font-extrabold tracking-wider uppercase transition-all duration-300 shadow-xs flex items-center gap-3 cursor-pointer group w-fit"
            >
              <span>See all questions</span>
              <span className="w-6 h-6 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center transition-all duration-300">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (Accordion List) */}
        <div className="lg:col-span-7 space-y-0">
          {faqItems.map((item, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="faq-item border-b border-voldog-teal/10 py-5.5 text-left transition-colors duration-300 hover:bg-voldog-lime/5 px-2 relative"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left gap-6 group cursor-pointer focus:outline-none"
                >
                  <span className="font-voldog font-extrabold text-base md:text-lg text-voldog-teal group-hover:text-[#6E7E6A] transition-colors leading-snug">
                    {item.question}
                  </span>

                  {/* Plus/Minus circle toggler */}
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-voldog-teal text-white rotate-180' : 'bg-[#F0F2F1] text-voldog-teal group-hover:bg-voldog-lime'
                    }`}>
                    {isOpen ? <Minus className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                  </span>
                </button>

                {/* Answer container with smooth pure CSS height transition */}
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-3.5' : 'grid-rows-[0fr] opacity-0'
                  }`}>
                  <div className="overflow-hidden">
                    <p className="text-xs md:text-sm text-voldog-teal/75 leading-relaxed font-semibold pr-8 font-voldog">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
