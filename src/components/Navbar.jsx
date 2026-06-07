import React, { useState, useEffect } from 'react'
import { ShoppingBag, Search, User } from 'lucide-react'
import { useStore } from '../store'

export default function Navbar({ activePage }) {
  const { cart, setCartOpen, currentPage, setCurrentPage } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const displayPage = activePage || currentPage
  const isHomeTop = displayPage === 'home' && !isScrolled

  const handleShopOnline = () => {
    setCurrentPage('catalog')
  }

  const handleNavClick = (page) => {
    setCurrentPage(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      style={{ transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease' }}
      className={`fixed top-0 left-0 right-0 z-40 ${isHomeTop
          ? 'opacity-0 pointer-events-none -translate-y-full'
          : 'opacity-100 translate-y-0'
        } bg-[#FAF9F5]/95 backdrop-blur-md border-b border-brand-sage/10 shadow-lg py-3 md:py-3.5`}
    >
      <div className="max-w-[95%] mx-auto px-4 flex justify-between items-center relative">

        {/* LEFT: OVII Logo */}
        <button onClick={() => handleNavClick('home')} className="flex items-center text-brand-gold hover:text-brand-sage transition-colors cursor-pointer shrink-0">
          <span className="font-voldog text-2xl md:text-3xl font-black text-brand-gold uppercase tracking-[0.12em] select-none">
            OVII
          </span>
        </button>

        {/* CENTER: Nav Links (desktop only, absolutely centered) */}
        <div className="hidden lg:flex items-center space-x-10 text-[18px] font-extrabold text-brand-charcoal font-sans uppercase tracking-[0.15em] absolute left-1/2 -translate-x-1/2">
          <button onClick={() => handleNavClick('catalog')} className="hover:text-brand-gold transition-colors cursor-pointer">
            Products
          </button>
          <button onClick={() => handleNavClick('contact')} className="hover:text-brand-gold transition-colors cursor-pointer">
            Contact
          </button>
        </div>

        {/* RIGHT: Icons + Shop Online + Mobile Menu */}
        <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
          <button className="p-1.5 hover:text-brand-gold transition-colors hidden sm:block text-brand-charcoal cursor-pointer" aria-label="Search">
            <Search className="w-[20px] h-[20px] stroke-[2.2]" />
          </button>
          <button className="p-1.5 hover:text-brand-gold transition-colors hidden sm:block text-brand-charcoal cursor-pointer" aria-label="User Profile">
            <User className="w-[20px] h-[20px] stroke-[2.2]" />
          </button>
          <button onClick={() => setCartOpen(true)} className="relative p-1.5 hover:text-brand-gold transition-colors text-brand-charcoal cursor-pointer" aria-label="Shopping Cart">
            <ShoppingBag className="w-[20px] h-[20px] stroke-[2.2]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#dbff37] text-brand-charcoal text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-xs font-sans">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={handleShopOnline}
            className="bg-[#dbff37] hover:bg-[#c3e62c] text-brand-charcoal px-6 py-3 rounded-full text-[12px] font-extrabold tracking-[0.1em] uppercase transition-all duration-300 shadow-sm cursor-pointer font-sans hidden lg:block"
          >
            Shop Online
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden w-[42px] h-[42px] rounded-full border border-brand-charcoal/20 hover:border-brand-charcoal/50 flex items-center justify-center transition-colors cursor-pointer text-brand-charcoal">
            <div className="w-5 h-2.5 flex flex-col justify-between items-center">
              <span className="w-full h-[2px] bg-current"></span>
              <span className="w-full h-[2px] bg-current"></span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-brand-sage/10 shadow-lg py-6 px-6 flex flex-col space-y-4 animate-fade-in z-50">
          <button
            onClick={() => handleNavClick('catalog')}
            className={`font-sans text-[18px] tracking-wide text-left py-2 border-b border-brand-gold/10 ${displayPage === 'catalog' ? 'text-brand-gold font-medium' : 'text-brand-charcoal/70'}`}
          >
            Products
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`font-sans text-[18px] tracking-wide text-left py-2 border-b border-brand-gold/10 ${displayPage === 'contact' ? 'text-brand-gold font-medium' : 'text-brand-charcoal/70'}`}
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  )
}
