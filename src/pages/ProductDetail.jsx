import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react'
import { useStore } from '../store'
import { PRODUCTS } from './Catalog'

// Rotating circular text badge SVG
const RotatingBadge = () => (
  <div
    className="absolute left-[3%] xl:left-[8%] top-[20px] md:top-[60px] w-36 h-36 hidden lg:block select-none animate-spin z-30"
    style={{ animationDuration: '22s' }}
  >
    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
      <defs>
        <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
      </defs>
      <text className="fill-voldog-teal/20 font-voldog font-black uppercase text-[5.8px] tracking-[0.25em]">
        <textPath href="#circlePath">
          * 100% NATURAL BALM * OVII HAND-POURED BALMS
        </textPath>
      </text>
    </svg>
  </div>
)

// Red handdrawn arrow pointing from the top section to the configuration card
const RedHanddrawnArrow = () => (
  <svg
    className="w-20 h-16 text-[#E26953] transform rotate-[15deg] pointer-events-none select-none absolute -top-14 left-8 hidden lg:block"
    viewBox="0 0 100 60"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
  >
    <path d="M10 10 Q 55 5, 80 45" />
    <path d="M68 42 L80 45 L78 33" />
  </svg>
)

// Reusable card for the Voldog-style "More products:" horizontal slider
function ProductCard({ prod }) {
  const { setCurrentPage, setSelectedProductId } = useStore()

  return (
    <div
      onClick={() => {
        setSelectedProductId(prod.id)
        setCurrentPage('product')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="bg-[#F0F2F1] rounded-[2rem] p-6 flex flex-col justify-between w-[280px] shrink-0 min-h-[380px] relative transition-all duration-300 hover:bg-white hover:shadow-lg border border-voldog-teal/5 group cursor-pointer"
    >
      {/* Sizes Badges visible on hover */}
      <div className="absolute top-4 left-4 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {prod.sizes && prod.sizes.map(size => (
          <span key={size} className="bg-white/95 text-voldog-teal font-extrabold text-[8px] uppercase py-1 px-2.5 rounded-full border border-voldog-teal/5">
            {size}
          </span>
        ))}
      </div>

      {/* Product Image */}
      <div className="h-44 flex items-center justify-center relative mb-4">
        <img
          src={prod.image}
          alt={prod.name}
          className="h-[90%] object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform duration-500 pointer-events-none"
        />
        <div className="absolute bottom-1 w-[60%] h-2 bg-voldog-teal/5 rounded-full blur-xs"></div>
      </div>

      {/* Info */}
      <div className="text-left space-y-1">
        <span className="block text-[8px] uppercase tracking-widest text-voldog-teal/50 font-black">{prod.family}</span>
        <h3 className="font-voldog font-black text-lg text-voldog-teal leading-snug group-hover:text-[#6E7E6A] transition-colors">{prod.name}</h3>
        <div className="text-sm font-black text-[#D0523C]">
          {prod.type === 'rollerball' ? (
            `₹${prod.price8g}.00`
          ) : (
            `₹${prod.price8g}.00 – ₹${prod.price15g}.00`
          )}
        </div>
      </div>

      {/* Place Order Button visible on hover */}
      <div className="mt-4 pt-2 border-t border-voldog-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full bg-white text-voldog-teal font-black text-xs py-2 px-4 rounded-full flex items-center justify-between border border-voldog-teal/10 shadow-xs">
          <span>Place your order</span>
          <span className="w-5 h-5 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center">
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { selectedProductId, addToCart, setCurrentPage, setCartOpen, products } = useStore()

  // Find active product
  const currentProductsList = useMemo(() => {
    return products.length > 0 ? products : PRODUCTS
  }, [products])

  const product = useMemo(() => {
    return currentProductsList.find(p => p.id === selectedProductId) || currentProductsList[0]
  }, [currentProductsList, selectedProductId])

  // Local config states
  const [selectedSize, setSelectedSize] = useState('15g')
  const [quantity, setQuantity] = useState(1)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeTab, setActiveTab] = useState('scent profile')

  const sliderRef = useRef(null)

  // Reset config on product change
  useEffect(() => {
    if (product) {
      // Default to first available size
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '15g'
      setSelectedSize(defaultSize)
    }
    setQuantity(1)
  }, [product])

  // Track scroll position to show sticky bottom bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get active price based on size
  const activePrice = useMemo(() => {
    if (product.type === 'rollerball') return 149
    return selectedSize === '8g' ? product.price8g : product.price15g
  }, [product, selectedSize])

  // Related products for the carousel (excluding the current product)
  const relatedProducts = useMemo(() => {
    return currentProductsList
      .filter(p => p.id !== product.id && p.isVisible !== false)
      .slice(0, 6)
  }, [currentProductsList, product])

  const handleAddToBag = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      scent: product.scent,
      image: product.image,
      family: product.family
    }
    addToCart(cartProduct, selectedSize, quantity, activePrice)
    setCartOpen(true)
  }

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320
      sliderRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-[#FAF9F5] text-voldog-teal font-sans min-h-screen pb-24 relative overflow-hidden">

      {/* 1. TOP HEADER AREA (Cream background) */}
      <section className="bg-[#FAF9F5] pt-32 pb-44 px-6 md:px-12 select-none relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          {/* Centered Breadcrumbs */}
          <div className="flex justify-center items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-voldog-teal/40 font-voldog">
            <button onClick={() => setCurrentPage('home')} className="hover:text-voldog-teal cursor-pointer transition-colors">Home</button>
            <span>›</span>
            <button onClick={() => setCurrentPage('catalog')} className="hover:text-voldog-teal cursor-pointer transition-colors">Products</button>
            <span>›</span>
            <span className="text-voldog-teal/60">{product.family}</span>
            <span>›</span>
            <span className="text-voldog-teal">{product.name}</span>
          </div>

          {/* Centered Title */}
          <h1 className="font-voldog text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-voldog-teal uppercase tracking-tight leading-[1.3]">
            {product.name}
          </h1>

          {/* Centered Short Description */}
          <p className="text-sm md:text-base text-voldog-teal/70 max-w-2xl mx-auto font-bold leading-[1.5] font-voldog">
            {product.description}
          </p>
        </div>
      </section>

      {/* 2. ABSOLUTE WHITE SECTION BACKGROUND WITH CONCAVE TOP WAVE */}
      <div className="absolute inset-x-0 bottom-0 top-[480px] md:top-[560px] bg-white z-0">
        {/* Concave Wave SVG */}
        <svg
          className="absolute top-0 left-0 w-full h-[60px] md:h-[100px] -translate-y-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,20 Q600,80 1200,20 L1200,100 L0,100 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 3. MAIN SECTION OVERLAY */}
      <section className="relative z-20 px-6 md:px-12 select-none -mt-36 md:-mt-48">
        <div className="max-w-8xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative min-h-[400px]">

            {/* Left Column: Rotating Badge */}
            <div className="lg:col-span-3 relative h-full">
              <RotatingBadge />
            </div>

            {/* Center Column: Product image centered */}
            <div className="lg:col-span-6 relative flex items-end justify-center select-none pt-8 lg:pt-0">
              {/* Product Photo */}
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[380px] md:max-h-[440px] object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.06)] relative z-10 transition-transform duration-700 hover:scale-[1.03]"
              />
              {/* Soft shadow */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[55%] h-3 bg-voldog-teal/10 rounded-full blur-xs"></div>
            </div>

            {/* Right Column: Configurator Card */}
            <div className="lg:col-span-3 relative mt-8 lg:mt-0">
              {/* Handdrawn Arrow */}
              <RedHanddrawnArrow />

              {/* Purchase Card */}
              <div className="bg-white rounded-[2.5rem] p-7 md:p-8 shadow-[0_15px_50px_rgba(32,78,74,0.06)] border border-voldog-teal/5 flex flex-col gap-6 max-w-sm mx-auto lg:ml-auto z-10 relative font-voldog select-none text-left">

                {/* Price Display */}
                <div className="space-y-1">
                  <span className="block text-[10px] text-voldog-teal/40 uppercase tracking-widest font-black">Price</span>
                  <div className="text-3xl font-black text-[#D0523C] leading-none">
                    ₹{activePrice}.00
                  </div>
                </div>

                {/* Size select capsules */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <span className="block text-[10px] text-voldog-teal/40 uppercase tracking-widest font-black">Select Packaging</span>
                    <div className="flex gap-2">
                      {product.sizes.map(size => {
                        const isSel = selectedSize === size
                        return (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border cursor-pointer transition-all duration-300 ${isSel
                              ? 'bg-voldog-teal text-white border-voldog-teal shadow-xs'
                              : 'bg-[#F0F2F1] text-voldog-teal border-transparent hover:border-voldog-teal/20'
                              }`}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity selector */}
                <div className="space-y-2">
                  <span className="block text-[10px] text-voldog-teal/40 uppercase tracking-widest font-black">Quantity</span>
                  <div className="flex items-center justify-between bg-[#F0F2F1] rounded-full p-1 border border-voldog-teal/5 w-full">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime transition-all focus:outline-none"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="font-black text-sm text-voldog-teal">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-8 h-8 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime transition-all focus:outline-none"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Add to bag button */}
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 bg-[#dbff37] hover:bg-voldog-teal hover:text-white text-voldog-teal font-black text-xs rounded-full flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer uppercase tracking-wider"
                >
                  Add to cart
                </button>

                {/* Subtext */}
                <div className="text-center text-[10px] text-voldog-teal/50 font-bold border-t border-voldog-teal/5 pt-4">
                  Free shipping for orders over ₹499
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. TABBED PRODUCT DETAILS (Voldog-style Ingredients & Specs container) */}
      <section className="bg-white py-20 px-6 md:px-12 select-none relative z-20 overflow-hidden">

        <div className="max-w-2xl mx-auto space-y-8 relative z-25">
          <div className="text-center space-y-2 mb-10">
            <span className="text-[10px] uppercase tracking-widest text-[#6E7E6A] font-extrabold font-voldog">Inside every bottle</span>
            <h2 className="font-voldog text-3xl md:text-5xl font-black text-voldog-teal uppercase tracking-tight leading-[1.3]">
              Within every blend of ours!
            </h2>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_15px_45px_rgba(32,78,74,0.04)] border border-voldog-teal/5 font-voldog select-none text-left">
            {/* Tab buttons */}
            <div className="bg-[#F0F2F1] rounded-full p-1 flex gap-1 mb-8 overflow-x-auto no-scrollbar">
              {['scent profile', 'ingredients', 'suitable for'].map((tabName) => {
                const isSelected = activeTab === tabName
                return (
                  <button
                    key={tabName}
                    onClick={() => setActiveTab(tabName)}
                    className={`w-full text-center py-2.5 px-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${isSelected
                      ? 'bg-voldog-lime text-voldog-teal shadow-xs'
                      : 'text-voldog-teal/60 hover:text-voldog-teal'
                      }`}
                  >
                    {tabName}
                  </button>
                )
              })}
            </div>

            {/* Tab contents */}
            <div className="min-h-[200px]">
              {activeTab === 'scent profile' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-voldog-teal/50 uppercase tracking-widest mb-2">Scent Profile & Accord Analysis:</h4>
                  <ul className="space-y-3.5 text-sm font-semibold text-voldog-teal/80">
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Scent Family:</strong> {product.family} – natural fragrance classification.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Intensity Score:</strong> {product.intensity}/5 – natural fragrance longevity and strength.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Harmonic Notes:</strong> {product.scent} – balanced natural accords.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Scent Vibe:</strong> Grounding and calming for active, working sensory profiles.
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-voldog-teal/50 uppercase tracking-widest mb-2">100% Natural Formulation:</h4>
                  <ul className="space-y-3.5 text-sm font-semibold text-voldog-teal/80">
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Organic Beeswax:</strong> Clean, sustainable base that retains fragrance oils.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Shea Butter & Coconut Oil:</strong> Deep skin-nourishing carrier blend.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Pure Essential Oils:</strong> Premium organic cold-pressed floral/woody extracts.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Vitamin E Tocopherol:</strong> 100% natural antioxidant and preservative.
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'suitable for' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-voldog-teal/50 uppercase tracking-widest mb-2">Usage & Application details:</h4>
                  <ul className="space-y-3.5 text-sm font-semibold text-voldog-teal/80">
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Skin Types:</strong> 100% suitable for all skin types, including sensitive skin.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Application Area:</strong> Pulse points (wrists, neck, behind ears) for best projection.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Zero synthetic chemicals:</strong> Alcohol-free, paraben-free, phthalate-free.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full border border-voldog-teal/40 inline-block mr-3 mt-1.5 shrink-0"></span>
                      <div>
                        <strong className="text-voldog-teal">Portability:</strong> Sleek, leakproof aluminum casing for effortless travel.
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 5. BALM APPLICATION GUIDE */}
      <section className="bg-[#FAF9F5] border-t border-voldog-teal/5 py-20 px-6 md:px-12 select-none relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">

          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-sage font-extrabold font-voldog">Scent Ritual</span>
            <h2 className="font-voldog text-3xl text-voldog-teal font-black leading-tight">Applying Your Solid Perfume</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xs font-voldog">
            <div className="space-y-4 p-4">
              <div className="w-12 h-12 rounded-full border border-voldog-teal/15 bg-white flex items-center justify-center font-serif text-lg text-voldog-teal font-bold mx-auto shadow-xs">1</div>
              <h4 className="font-voldog text-base font-extrabold text-voldog-teal">Warm Scent Balm</h4>
              <p className="text-voldog-teal/70 leading-relaxed font-semibold">
                Swirl your clean finger gently across the wax surface. The organic beeswax base liquefies slightly under your natural body warmth.
              </p>
            </div>

            <div className="space-y-4 p-4">
              <div className="w-12 h-12 rounded-full border border-voldog-teal/15 bg-white flex items-center justify-center font-serif text-lg text-voldog-teal font-bold mx-auto shadow-xs">2</div>
              <h4 className="font-voldog text-base font-extrabold text-voldog-teal">Dab on Pulse Points</h4>
              <p className="text-voldog-teal/70 leading-relaxed font-semibold">
                Apply the botanical balm directly onto warm pulse points: inner wrists, base of the throat, and behind your ear lobes.
              </p>
            </div>

            <div className="space-y-4 p-4">
              <div className="w-12 h-12 rounded-full border border-voldog-teal/15 bg-white flex items-center justify-center font-serif text-lg text-voldog-teal font-bold mx-auto shadow-xs">3</div>
              <h4 className="font-voldog text-base font-extrabold text-voldog-teal">Refresh On-The-Go</h4>
              <p className="text-voldog-teal/70 leading-relaxed font-semibold">
                Slip the tin into pocket or handbag. The solid formulation means no leaking or evaporating, ready for refreshers anytime.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. MORE PRODUCTS SECTION (White background) */}
      <section className="bg-white py-24 relative z-20 border-t border-voldog-teal/5">
        <h2 className="font-voldog text-4xl md:text-5xl font-black text-voldog-teal text-center mb-12 uppercase tracking-tight">
          More products:
        </h2>

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FAF9F5] border border-voldog-teal/10 flex items-center justify-center text-voldog-teal hover:bg-voldog-lime hover:border-transparent transition-all z-20 cursor-pointer shadow-sm hidden md:flex"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Slider container */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 px-2"
          >
            {relatedProducts.map(prod => (
              <ProductCard key={prod.id} prod={prod} />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollSlider('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center hover:bg-voldog-teal hover:text-white transition-all z-20 cursor-pointer shadow-sm hidden md:flex"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* All Products Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => {
              setCurrentPage('catalog')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="bg-[#F0F2F1] hover:bg-voldog-teal hover:text-white text-voldog-teal font-black text-xs py-3.5 px-7 rounded-full flex items-center gap-3 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>All products</span>
            <span className="w-5 h-5 rounded-full bg-voldog-lime text-voldog-teal flex items-center justify-center">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </span>
          </button>
        </div>
      </section>

      {/* 5. DESKTOP STICKY BOTTOM PURCHASE BAR */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-voldog-teal/10 shadow-[0_-8px_30px_rgba(32,78,74,0.08)] py-3 px-8 z-40 transition-transform duration-300 hidden md:flex items-center justify-between font-voldog ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center gap-4">
          <img src={product.image} alt={product.name} className="h-10 w-10 object-contain" />
          <div className="text-left">
            <h4 className="font-black text-base text-voldog-teal uppercase tracking-tight leading-none mb-1">{product.name}</h4>
            <div className="text-sm font-black text-[#D0523C]">
              ₹{activePrice * quantity}.00
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Select Size Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-voldog-teal/50 uppercase tracking-widest font-black">Select Size</span>
              <div className="flex gap-1.5">
                {product.sizes.map(size => {
                  const isSel = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-all ${isSel
                        ? 'bg-voldog-teal text-white border-voldog-teal'
                        : 'bg-[#F0F2F1] text-voldog-teal border-transparent hover:border-voldog-teal/20'
                        }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="flex items-center justify-between bg-[#F0F2F1] rounded-full p-0.5 border border-voldog-teal/5 w-28">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime focus:outline-none animate-none"
            >
              <Minus className="w-3 h-3 stroke-[2.5]" />
            </button>
            <span className="font-black text-xs text-voldog-teal">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-7 h-7 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime focus:outline-none animate-none"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToBag}
            className="bg-[#dbff37] hover:bg-voldog-teal hover:text-white text-voldog-teal py-3 px-8 rounded-full text-xs uppercase tracking-widest font-black transition-all cursor-pointer shadow-xs"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* 6. MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-voldog-teal/10 shadow-[0_-8px_30px_rgba(32,78,74,0.08)] p-4 flex items-center justify-between font-voldog transform transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="text-left">
          <span className="block text-[9px] text-voldog-teal/50 uppercase tracking-widest font-black leading-none mb-1">{product.name} • {selectedSize}</span>
          <span className="text-base font-black text-[#D0523C]">₹{activePrice * quantity}.00</span>
        </div>
        <button
          onClick={handleAddToBag}
          className="bg-[#dbff37] hover:bg-voldog-teal hover:text-white text-voldog-teal py-2.5 px-5 rounded-full text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <span>Add to cart</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  )
}
