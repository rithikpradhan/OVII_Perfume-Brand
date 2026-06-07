import React from 'react'
import { X, Plus, Minus, Trash2, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react'
import { useStore } from '../store'

export default function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, setCurrentPage } = useStore()

  if (!isCartOpen) return null

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 50 // ₹50 shipping or free above ₹999
  const freeShippingThreshold = 999
  const isFreeShipping = subtotal >= freeShippingThreshold
  const amountNeeded = freeShippingThreshold - subtotal
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const total = isFreeShipping ? subtotal : subtotal + shipping

  const handleCheckoutClick = () => {
    setCartOpen(false)
    setCurrentPage('checkout')
  }

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop Overlay */}
      <div 
        className="absolute inset-0 bg-[#204e4a]/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-md bg-[#FAF9F5] border-l border-voldog-teal/10 shadow-2xl flex flex-col animate-slide-left h-full">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-voldog-teal/10 flex items-center justify-between bg-white z-10">
            <div className="text-left">
              <h2 className="font-voldog text-xl font-black text-voldog-teal uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-voldog-teal" />
                <span>Shopping Bag</span>
              </h2>
              {totalItemCount > 0 && (
                <span className="text-[10px] text-voldog-teal/50 font-black uppercase tracking-wider">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your cart
                </span>
              )}
            </div>
            <button 
              onClick={() => setCartOpen(false)}
              className="w-10 h-10 rounded-full border border-voldog-teal/15 hover:border-voldog-teal flex items-center justify-center text-voldog-teal/70 hover:text-voldog-teal hover:rotate-90 transition-all duration-300 cursor-pointer"
              aria-label="Close Cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="px-6 py-3.5 bg-white border-b border-voldog-teal/5 text-left font-voldog">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-voldog-teal/70 mb-2">
                <span>
                  {isFreeShipping 
                    ? "🎉 Free shipping unlocked!" 
                    : `Add ₹${amountNeeded} more for free shipping`
                  }
                </span>
                <span className="text-voldog-teal/40">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#F0F2F1] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-voldog-lime rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Contents */}
          <div className="flex-grow py-6 overflow-y-auto px-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-5 py-12">
                <div className="w-20 h-20 rounded-full bg-voldog-lime/15 text-voldog-teal flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h3 className="font-voldog text-base font-black text-voldog-teal uppercase tracking-tight">Your bag is empty</h3>
                  <p className="text-xs text-voldog-teal/60 font-semibold leading-relaxed">
                    Discover our collection of premium hand-poured botanical solid perfumes and liquid mists.
                  </p>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="font-voldog text-xs uppercase tracking-widest bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal px-8 py-4 rounded-full transition-all duration-350 cursor-pointer font-black shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.cartId} 
                  className="bg-white rounded-2xl p-4 shadow-xs border border-voldog-teal/5 flex gap-4 items-center transition-all hover:shadow-sm"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-[#F0F2F1] border border-voldog-teal/5 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-left">
                        <h4 className="font-voldog text-xs font-black text-voldog-teal uppercase tracking-tight leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[9px] font-black text-voldog-teal/40 uppercase tracking-widest mt-1">
                          {item.scent} • {item.size}
                        </p>
                      </div>
                      <span className="text-sm font-black text-[#D0523C] shrink-0 font-voldog">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {/* Quantity Selector and Delete */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Premium Quantity Pills */}
                      <div className="flex items-center justify-between bg-[#F0F2F1] rounded-full p-0.5 border border-voldog-teal/5 w-24 select-none">
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime transition-all focus:outline-none"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-black text-voldog-teal font-mono">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white text-voldog-teal flex items-center justify-center cursor-pointer hover:bg-voldog-lime transition-all focus:outline-none"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="w-8 h-8 rounded-full border border-voldog-teal/10 hover:border-transparent text-voldog-teal/40 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all duration-300 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer (Pricing Summary) */}
          {cart.length > 0 && (
            <div className="border-t border-voldog-teal/10 px-6 py-6 bg-white space-y-4 shadow-[0_-8px_30px_rgba(32,78,74,0.04)]">
              <div className="space-y-2.5 text-xs font-voldog">
                <div className="flex justify-between text-voldog-teal/70 font-semibold">
                  <span>Bag Subtotal</span>
                  <span className="font-bold">₹{subtotal}.00</span>
                </div>
                <div className="flex justify-between text-voldog-teal/70 font-semibold">
                  <span>Shipping</span>
                  <span className="font-bold">{isFreeShipping ? 'Free' : `₹${shipping}.00`}</span>
                </div>
                
                <div className="flex justify-between text-base font-black text-voldog-teal pt-3 border-t border-voldog-teal/5">
                  <span>Total Amount</span>
                  <span className="text-[#D0523C] text-lg">₹{total}.00</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-[#dbff37] hover:bg-voldog-teal hover:text-white text-voldog-teal py-4.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md flex justify-center items-center cursor-pointer font-voldog"
              >
                <span>Proceed to Checkout</span>
              </button>
              
              <div className="flex items-center justify-center space-x-2 text-[10px] text-voldog-teal/40 font-bold font-voldog uppercase tracking-wider pt-1">
                <ShieldCheck className="w-4 h-4 text-voldog-teal/50" />
                <span>Secure Payments • 100% Botanical Alchemy</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
