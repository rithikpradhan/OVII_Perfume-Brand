import React from 'react'
import { ShoppingBag, Eye } from 'lucide-react'
import { useStore } from '../store'

export default function ScentCard({ product }) {
  const { addToCart, setCurrentPage, setSelectedProductId } = useStore()

  const handleCardClick = () => {
    setSelectedProductId(product.id)
    setCurrentPage('product')
  }

  const handleAddToBag = (e) => {
    e.stopPropagation()
    const size = product.id === 'reset-serum' ? '30ml' 
               : product.id === 'hydra-foam-cleanser' ? '150ml'
               : product.id === 'hydra-nutrition-essence' ? '100ml'
               : '15g'
    addToCart(product, size, 1, product.price)
  }

  return (
    <div className="w-full bg-brand-cream/10 border border-brand-gold/15 rounded-xs p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(201,168,76,0.1)] group font-sans">
      
      {/* Product Image */}
      <div 
        onClick={handleCardClick}
        className="relative w-full aspect-square bg-brand-cream/20 border border-brand-gold/10 rounded-xs overflow-hidden cursor-pointer"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Overlay with CTA */}
        <div className="absolute inset-0 bg-brand-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <span className="bg-brand-ivory text-brand-charcoal hover:bg-brand-gold hover:text-brand-ivory p-3 rounded-full transition-colors duration-300 shadow-md">
            <Eye className="w-4.5 h-4.5" />
          </span>
        </div>

        {/* Scent Tag / Family Tag */}
        <div className="absolute top-3 left-3 bg-brand-ivory/95 backdrop-blur-xs text-brand-charcoal text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-xs border border-brand-gold/15 font-semibold">
          {product.family}
        </div>
      </div>

      <div className="mt-5 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex flex-col text-left space-y-1">
            <h3 
              onClick={handleCardClick}
              className="font-sans text-[15px] md:text-[16px] font-semibold text-brand-charcoal hover:text-brand-gold transition-colors cursor-pointer tracking-wide"
            >
              {product.name}
            </h3>
            <span className="text-sm font-semibold text-brand-gold font-sans">
              ₹{product.price}
            </span>
          </div>
          <p className="text-[10px] text-brand-sage uppercase tracking-wider font-semibold mt-2.5">
            Actives: {product.scent}
          </p>
          <p className="text-xs text-brand-charcoal/70 leading-relaxed mt-2 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        {/* Add to Cart Button */}
        <div className="pt-4 mt-auto">
          <button 
            onClick={handleAddToBag}
            className="w-full font-sans text-[11px] uppercase tracking-widest py-3 rounded-xs border border-[#C5A866]/30 text-[#C5A866] hover:bg-[#dbff37] hover:text-[#161616] hover:border-[#dbff37] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  )
}
