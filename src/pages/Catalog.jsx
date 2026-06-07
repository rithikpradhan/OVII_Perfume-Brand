import React, { useState, useMemo, useEffect, useRef } from 'react'
import { SlidersHorizontal, ChevronDown, Plus, Minus, ArrowRight, X } from 'lucide-react'
import { useStore } from '../store'
import { gsap } from 'gsap'

export const PRODUCTS = [
  {
    id: 'jasmine-touch',
    name: 'Jasmine Touch',
    price8g: 299,
    price15g: 499,
    type: 'solid',
    scent: 'Star Jasmine • Warm Amber • Citrus',
    family: 'Floral',
    description: 'A delicate white floral bouquet grounded in soft warm amber. Sophisticated, light, and deeply comforting.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true,
    isNew: false,
    dateAdded: '2026-01-01',
    intensity: 3,
    sizes: ['8g', '15g']
  },
  {
    id: 'sandalwood-reverie',
    name: 'Sandalwood Reverie',
    price8g: 349,
    price15g: 549,
    type: 'solid',
    scent: 'Mysore Sandalwood • Cedarwood • Warm Gold Amber',
    family: 'Woody',
    description: 'Rich woody core balanced by warm amber tones. An earthier, grounding unisex fragrance representing quiet luxury.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-02-15',
    intensity: 4,
    sizes: ['8g', '15g']
  },
  {
    id: 'fresh-citrus-bloom',
    name: 'Fresh Citrus Bloom',
    price8g: 279,
    price15g: 449,
    type: 'solid',
    scent: 'Bergamot • Lemon Zest • Neroli Bloom',
    family: 'Fresh',
    description: 'Sparkling citrus notes layered over soft orange blossoms. Revitalizing, clean, and sun-drenched.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: true,
    dateAdded: '2026-05-15',
    intensity: 2,
    sizes: ['8g', '15g']
  },
  {
    id: 'oud-noir',
    name: 'Oud Noir',
    price8g: 449,
    price15g: 699,
    type: 'solid',
    scent: 'Dark Oud • Smoky Vetiver • Warm Vanilla',
    family: 'Oriental',
    description: 'A deep, mysterious blend of rich agarwood and smoky vetiver, rounded with sweet vanilla beans.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true,
    isNew: true,
    dateAdded: '2026-05-20',
    intensity: 5,
    sizes: ['8g', '15g']
  },
  {
    id: 'rose-petal-mist',
    name: 'Rose Petal Mist',
    price8g: 299,
    price15g: 499,
    type: 'mist',
    scent: 'Damask Rose • Morning Dew • Soft White Musk',
    family: 'Floral',
    description: 'A crisp, modern interpretation of classic rose, softened by light morning dew and clean white musk.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: true,
    dateAdded: '2026-05-01',
    intensity: 3,
    sizes: ['15g']
  },
  {
    id: 'jasmine-delicacy',
    name: 'Jasmine Delicacy',
    price8g: 149,
    price15g: 149,
    type: 'rollerball',
    scent: 'Star Jasmine • White Musk',
    family: 'Floral',
    description: 'A pocket-sized rollerball perfume that provides a quick floral touch-up on the go.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-06-01',
    intensity: 3,
    sizes: ['10ml']
  },
  {
    id: 'sandalwood-delicacy',
    name: 'Sandalwood Delicacy',
    price8g: 149,
    price15g: 149,
    type: 'rollerball',
    scent: 'Mysore Sandalwood • Cedar',
    family: 'Woody',
    description: 'Pocket roll-on featuring rich Mysore sandalwood notes for grounding woody comfort.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-06-01',
    intensity: 4,
    sizes: ['10ml']
  },
  {
    id: 'citrus-delicacy',
    name: 'Citrus Delicacy',
    price8g: 149,
    price15g: 149,
    type: 'rollerball',
    scent: 'Bergamot • Lemon Zest',
    family: 'Fresh',
    description: 'A sparkling citrus roll-on designed to refresh your senses instantly.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-06-01',
    intensity: 2,
    sizes: ['10ml']
  },
  {
    id: 'oud-delicacy',
    name: 'Oud Delicacy',
    price8g: 149,
    price15g: 149,
    type: 'rollerball',
    scent: 'Dark Oud • Smoky Vetiver',
    family: 'Oriental',
    description: 'An intense, smoky vetiver and agarwood luxury roll-on.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-06-01',
    intensity: 5,
    sizes: ['10ml']
  },
  {
    id: 'rose-delicacy',
    name: 'Rose Delicacy',
    price8g: 149,
    price15g: 149,
    type: 'rollerball',
    scent: 'Damask Rose • Soft Musk',
    family: 'Floral',
    description: 'A classic, light Damask Rose roll-on with clean musk undertones.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-06-01',
    intensity: 3,
    sizes: ['10ml']
  }
]

export default function Catalog() {
  const { setCurrentPage, setSelectedProductId, products, addToCart, setCartOpen } = useStore()
  
  // Filtering States
  const [selectedType, setSelectedType] = useState('all') // 'all' | 'solid' | 'mist' | 'rollerball'
  const [selectedFamilies, setSelectedFamilies] = useState([]) // Scent family filters
  const [selectedIntensities, setSelectedIntensities] = useState([]) // Scent intensity filters
  const [selectedSizes, setSelectedSizes] = useState([]) // Size/Volume filters
  const [selectedPacking, setSelectedPacking] = useState('all') // Bottom Packing pill filter
  const [sortBy, setSortBy] = useState('default')
  
  // Collapsible Sidebar Sections States
  const [openIntensity, setOpenIntensity] = useState(true)
  const [openSizes, setOpenSizes] = useState(true)
  
  // Mobile Filter Drawer State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const catalogRef = useRef(null)

  // Trigger smooth reveal animation on cards mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".catalog-card", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      )
    }, catalogRef)
    return () => ctx.revert()
  }, [selectedType, selectedFamilies, selectedIntensities, selectedSizes, selectedPacking, sortBy])

  // Complete List Source (Zustand store or fallbacks)
  const baseProducts = useMemo(() => {
    const dbList = products.length > 0 ? products : PRODUCTS
    return dbList.filter(p => p.isVisible !== false)
  }, [products])

  // Count Calculators (dynamic counts based on Database/Static totals)
  const counts = useMemo(() => {
    const result = {
      types: { solid: 0, mist: 0, rollerball: 0 },
      families: { Floral: 0, Woody: 0, Fresh: 0, Oriental: 0 },
      intensities: { 2: 0, 3: 0, 4: 0, 5: 0 },
      sizes: { '8g': 0, '15g': 0, '10ml': 0 }
    }

    baseProducts.forEach(p => {
      // Types
      if (p.type && result.types[p.type] !== undefined) {
        result.types[p.type]++
      }
      // Families
      if (p.family && result.families[p.family] !== undefined) {
        result.families[p.family]++
      }
      // Intensities
      if (p.intensity && result.intensities[p.intensity] !== undefined) {
        result.intensities[p.intensity]++
      }
      // Sizes
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(s => {
          if (result.sizes[s] !== undefined) {
            result.sizes[s]++
          }
        })
      }
    })

    return result
  }, [baseProducts])

  // Main Filter and Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...baseProducts]

    // 1. Filter by Scent Type (Solid / Mist / Rollerball)
    if (selectedType !== 'all') {
      result = result.filter(p => p.type === selectedType)
    }

    // 2. Filter by Scent Families (Floral, Woody, etc.)
    if (selectedFamilies.length > 0) {
      result = result.filter(p => selectedFamilies.includes(p.family))
    }

    // 3. Filter by Scent Intensities
    if (selectedIntensities.length > 0) {
      result = result.filter(p => selectedIntensities.includes(p.intensity))
    }

    // 4. Filter by Sizes
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)))
    }

    // 5. Filter by Packing Pill
    if (selectedPacking !== 'all') {
      result = result.filter(p => p.sizes && p.sizes.includes(selectedPacking))
    }

    // 6. Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price8g || a.price) - (b.price8g || b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.price8g || b.price) - (a.price8g || a.price))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.created_at || b.dateAdded) - new Date(a.created_at || a.dateAdded))
        break
      case 'default':
      default:
        // Best sellers first, then default
        result.sort((a, b) => {
          if (a.isBestSeller && !b.isBestSeller) return -1
          if (!a.isBestSeller && b.isBestSeller) return 1
          return 0
        })
        break
    }

    return result
  }, [baseProducts, selectedType, selectedFamilies, selectedIntensities, selectedSizes, selectedPacking, sortBy])

  // Add to cart handler
  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    // Select first size available in array
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '8g'
    const defaultPrice = defaultSize === '8g' ? product.price8g : (defaultSize === '15g' ? product.price15g : 149)
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      scent: product.scent,
      image: product.image,
      family: product.family
    }
    addToCart(cartProduct, defaultSize, 1, defaultPrice)
    setCartOpen(true)
  }

  // Handle Multi-Checkbox Filters
  const handleFamilyToggle = (family) => {
    setSelectedFamilies(prev => 
      prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]
    )
  }

  const handleIntensityToggle = (intensity) => {
    setSelectedIntensities(prev => 
      prev.includes(intensity) ? prev.filter(i => i !== intensity) : [...prev, intensity]
    )
  }

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  // Categories switcher bar selection synced with sidebar filters
  const handleCategoryPillClick = (category) => {
    // Reset filters
    setSelectedType('all')
    setSelectedFamilies([])
    setSelectedPacking('all')

    if (category === 'all') {
      // Clear all
    } else if (category === 'solid' || category === 'mist' || category === 'rollerball') {
      setSelectedType(category)
    } else {
      // Scent family
      setSelectedFamilies([category])
    }
  }

  // Render Sidebar Filters Content
  const renderSidebarFilters = () => (
    <div className="space-y-8 text-left font-voldog select-none">
      
      {/* Scent Type Filter (Dog or Cat? Radio equivalent) */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-voldog-teal uppercase tracking-wider">Type of Scent</h3>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
            <input 
              type="radio" 
              name="scentType" 
              checked={selectedType === 'all'} 
              onChange={() => setSelectedType('all')}
              className="accent-voldog-teal w-4 h-4 cursor-pointer"
            />
            <span>all products</span>
          </label>
          <label className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
            <input 
              type="radio" 
              name="scentType" 
              checked={selectedType === 'solid'} 
              onChange={() => setSelectedType('solid')}
              className="accent-voldog-teal w-4 h-4 cursor-pointer"
            />
            <span>solid perfumes ({counts.types.solid})</span>
          </label>
          <label className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
            <input 
              type="radio" 
              name="scentType" 
              checked={selectedType === 'mist'} 
              onChange={() => setSelectedType('mist')}
              className="accent-voldog-teal w-4 h-4 cursor-pointer"
            />
            <span>liquid mists ({counts.types.mist})</span>
          </label>
          <label className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
            <input 
              type="radio" 
              name="scentType" 
              checked={selectedType === 'rollerball'} 
              onChange={() => setSelectedType('rollerball')}
              className="accent-voldog-teal w-4 h-4 cursor-pointer"
            />
            <span>rollerball scents ({counts.types.rollerball})</span>
          </label>
        </div>
      </div>

      {/* Scent Categories Filter (Product categories Checkboxes equivalent) */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-sm text-voldog-teal uppercase tracking-wider">Scent categories</h3>
        <div className="space-y-2.5">
          {Object.keys(counts.families).map(family => (
            <label key={family} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedFamilies.includes(family)}
                onChange={() => handleFamilyToggle(family)}
                className="accent-voldog-teal rounded-sm w-4 h-4 cursor-pointer"
              />
              <span>{family} ({counts.families[family]})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Scent Intensity Filter (Collapsible Section) */}
      <div className="border-t border-voldog-teal/10 pt-5">
        <button 
          onClick={() => setOpenIntensity(!openIntensity)}
          className="w-full flex justify-between items-center text-left font-extrabold text-sm text-voldog-teal uppercase tracking-wider focus:outline-none cursor-pointer"
        >
          <span>Scent Intensity</span>
          {openIntensity ? <Minus className="w-4 h-4 text-voldog-teal/50" /> : <Plus className="w-4 h-4 text-voldog-teal/50" />}
        </button>
        {openIntensity && (
          <div className="space-y-2.5 mt-3 animate-fade-in">
            {[2, 3, 4, 5].map(intensity => (
              <label key={intensity} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedIntensities.includes(intensity)}
                  onChange={() => handleIntensityToggle(intensity)}
                  className="accent-voldog-teal rounded-sm w-4 h-4 cursor-pointer"
                />
                <span>Level {intensity} ({counts.intensities[intensity]})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sizes / Vol Filter (Collapsible Section) */}
      <div className="border-t border-voldog-teal/10 pt-5">
        <button 
          onClick={() => setOpenSizes(!openSizes)}
          className="w-full flex justify-between items-center text-left font-extrabold text-sm text-voldog-teal uppercase tracking-wider focus:outline-none cursor-pointer"
        >
          <span>Size / Volume</span>
          {openSizes ? <Minus className="w-4 h-4 text-voldog-teal/50" /> : <Plus className="w-4 h-4 text-voldog-teal/50" />}
        </button>
        {openSizes && (
          <div className="space-y-2.5 mt-3 animate-fade-in">
            {['8g', '15g', '10ml'].map(size => (
              <label key={size} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-voldog-teal/70 hover:text-voldog-teal cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  className="accent-voldog-teal rounded-sm w-4 h-4 cursor-pointer"
                />
                <span>{size} ({counts.sizes[size]})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Packing Pill Selector (Bottom of filters) */}
      <div className="border-t border-voldog-teal/10 pt-5 space-y-3">
        <h3 className="font-extrabold text-sm text-voldog-teal uppercase tracking-wider">Packing</h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {['all', '8g', '15g', '10ml'].map(size => {
            const isSel = selectedPacking === size
            return (
              <button
                key={size}
                onClick={() => setSelectedPacking(size)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                  isSel
                    ? 'bg-voldog-teal text-white border-voldog-teal'
                    : 'bg-[#F0F2F1] text-voldog-teal/70 border-transparent hover:border-voldog-teal/30'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )

  return (
    <div className="bg-[#FAF9F5] text-voldog-teal pt-32 pb-24 min-h-screen">
      
      {/* Title block with underline doodle */}
      <div className="max-w-8xl mx-auto px-6 md:px-12 text-center space-y-6">
        <h1 className="font-voldog text-4xl md:text-[52px] text-voldog-teal font-extrabold tracking-tight leading-[1.5] select-text">
          All our <span className="relative inline-block px-1">
            perfumes
            <svg className="absolute left-0 bottom-[-8px] w-full h-3 text-voldog-lime overflow-visible select-none pointer-events-none" viewBox="0 0 100 10" fill="none" preserveAspectRatio="none">
              <path className="scents-underline-path" d="M2 5 C 30 2, 70 2, 98 5" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </span> in one place!
        </h1>

        {/* Category switcher bar (capsules list) */}
        <div className="flex flex-wrap justify-center gap-3 pt-6 max-w-5xl mx-auto font-voldog select-none">
          <button
            onClick={() => handleCategoryPillClick('all')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedType === 'all' && selectedFamilies.length === 0
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => handleCategoryPillClick('solid')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedType === 'solid'
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Solid Perfumes
          </button>
          <button
            onClick={() => handleCategoryPillClick('mist')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedType === 'mist'
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Liquid Mists
          </button>
          <button
            onClick={() => handleCategoryPillClick('rollerball')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedType === 'rollerball'
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Rollerball Scents
          </button>
          <button
            onClick={() => handleCategoryPillClick('Floral')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedFamilies.includes('Floral')
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Floral Family
          </button>
          <button
            onClick={() => handleCategoryPillClick('Woody')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedFamilies.includes('Woody')
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Woody Family
          </button>
          <button
            onClick={() => handleCategoryPillClick('Fresh')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedFamilies.includes('Fresh')
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Fresh Family
          </button>
          <button
            onClick={() => handleCategoryPillClick('Oriental')}
            className={`px-6 py-3.5 text-[11px] uppercase tracking-wider font-extrabold rounded-full transition-colors cursor-pointer ${
              selectedFamilies.includes('Oriental')
                ? 'bg-[#E5ECE5] text-voldog-teal border border-voldog-teal/15 font-black shadow-xs'
                : 'bg-[#F0F2F1] text-voldog-teal/70 hover:text-voldog-teal'
            }`}
          >
            Oriental Family
          </button>
        </div>

      </div>

      {/* Main content grid: Left Sidebar + Right Catalog Products */}
      <div className="max-w-8xl mx-auto px-6 md:px-12 mt-16">
        
        {/* Toggle bar for mobile filters */}
        <div className="lg:hidden flex justify-between items-center bg-[#F0F2F1] py-4 px-5 rounded-2xl mb-8 font-voldog">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-sm font-extrabold uppercase text-voldog-teal cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter and Categories</span>
          </button>
          <span className="text-xs font-semibold text-voldog-teal/60">
            {filteredAndSortedProducts.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT SIDEBAR FILTERS (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3">
            {renderSidebarFilters()}
          </aside>

          {/* RIGHT PRODUCTS GRID */}
          <main className="lg:col-span-9 space-y-6" ref={catalogRef}>
            
            {/* Sorting and Count Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-voldog-teal/5 pb-4 font-voldog">
              <span className="text-sm font-semibold text-voldog-teal/60 text-left w-full sm:w-auto">
                Showing {filteredAndSortedProducts.length} of {baseProducts.length} products
              </span>
              
              <div className="relative flex items-center w-full sm:w-auto justify-end select-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#F0F2F1] border border-transparent hover:border-voldog-teal/20 text-xs text-voldog-teal font-extrabold uppercase tracking-wider pl-5 pr-10 py-3 rounded-full focus:outline-none cursor-pointer"
                >
                  <option value="default">Default order</option>
                  <option value="price-asc">Sort by: Price (Low to High)</option>
                  <option value="price-desc">Sort by: Price (High to Low)</option>
                  <option value="newest">Sort by: Newest Launch</option>
                </select>
                <div className="pointer-events-none absolute right-4 text-voldog-teal/60">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Catalog Grid (3-column layout matching reference) */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#F0F2F1]/30 border border-voldog-teal/5 rounded-[2.5rem] space-y-4 font-voldog">
                <p className="text-lg font-bold text-voldog-teal">No matching perfumes found</p>
                <p className="text-sm text-voldog-teal/60">Try clearing some filters in the sidebar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredAndSortedProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setSelectedProductId(product.id)
                      setCurrentPage('product')
                    }}
                    className="catalog-card bg-[#F0F2F1] rounded-[2.5rem] p-7 md:p-8 border border-voldog-teal/5 flex flex-col justify-between min-h-[440px] transition-all duration-500 hover:scale-[1.02] hover:bg-white hover:shadow-md cursor-pointer group"
                  >
                    
                    {/* Top left weight pills & centerpiece photo container */}
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center relative mb-6">
                      
                      {/* Weight Options Pills on Top Left */}
                      <div className="absolute top-0 left-0 flex gap-1.5 z-20 select-none">
                        {product.sizes && product.sizes.map(size => (
                          <span 
                            key={size} 
                            className="bg-white/85 text-voldog-teal font-extrabold text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-full border border-voldog-teal/5 shadow-xs"
                          >
                            {size}
                          </span>
                        ))}
                      </div>

                      {/* Floating Perfume Bottle Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-[85%] object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700 pointer-events-none z-10"
                      />
                      
                      {/* Soft ground shadow underneath bottle */}
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[55%] h-2 bg-voldog-teal/10 rounded-full blur-xs transition-all duration-700 group-hover:scale-x-90 group-hover:opacity-60"></div>
                    </div>

                    {/* Scent Info (Left-aligned details matching Voldog layout) */}
                    <div className="font-voldog text-left space-y-1.5">
                      
                      <div className="space-y-0.5">
                        <span className="block text-[9px] uppercase tracking-widest text-voldog-teal/50 font-extrabold">
                          {product.family}
                        </span>
                        
                        <h3 className="font-voldog font-extrabold text-lg text-voldog-teal leading-snug group-hover:text-[#6E7E6A] transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {/* Dynamic Price Range or Single Price */}
                      <div className="flex justify-between items-center">
                        <span className="block text-sm md:text-[15px] font-semibold text-[#D0523C]">
                          {product.type === 'rollerball' ? (
                            `₹${product.price8g}.00`
                          ) : (
                            `₹${product.price8g}.00 – ₹${product.price15g}.00`
                          )}
                        </span>
                        {/* Decorative Green Dot */}
                        <div className="w-1.5 h-1.5 rounded-full bg-voldog-lime"></div>
                      </div>

                      {/* Slide up add to cart button matching Voldog exactly */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full py-3 bg-white hover:bg-voldog-teal hover:text-white text-voldog-teal font-extrabold text-xs rounded-full flex items-center justify-between px-6 transition-all duration-350 shadow-xs mt-4 group/btn select-none cursor-pointer"
                      >
                        <span>Add to cart</span>
                        <span className="w-6 h-6 rounded-full bg-[#dbff37] text-voldog-teal flex items-center justify-center transition-colors group-hover/btn:bg-white group-hover/btn:text-voldog-teal">
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </main>

        </div>
      </div>

      {/* MOBILE DRAWER FILTERS MODAL */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-voldog lg:hidden select-none">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#FAF9F5] shadow-xl flex flex-col p-6 space-y-6 overflow-y-auto relative animate-slide-left" style={{ animationName: 'slide-right' }}>
            <div className="flex justify-between items-center border-b border-voldog-teal/10 pb-4">
              <h3 className="font-extrabold text-base text-voldog-teal uppercase tracking-wider">Filters</h3>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="text-voldog-teal/50 hover:text-voldog-teal focus:outline-none cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {renderSidebarFilters()}
          </div>
        </div>
      )}

    </div>
  )
}
