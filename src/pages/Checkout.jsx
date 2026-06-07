import React, { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, ShoppingBag, Truck, X } from 'lucide-react'
import { useStore } from '../store'
import { dbService } from '../services/supabase'
import { notificationService } from '../services/notifications'

export default function Checkout() {
  const { cart, clearCart, setCurrentPage } = useStore()
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    city: '',
    state: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay') // 'razorpay' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false) // fallback modal
  const [razorpayMethod, setRazorpayMethod] = useState('upi') // 'upi' | 'card'
  const [showReceipt, setShowReceipt] = useState(false)
  const [showFailureRetry, setShowFailureRetry] = useState(false)
  const [orderId, setOrderId] = useState('')

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 50
  const total = subtotal + shipping

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // Handle Checkout submission
  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setShowFailureRetry(false)
    
    // Check if Razorpay credentials exist
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID

    if (paymentMethod === 'razorpay') {
      if (window.Razorpay && razorpayKey && razorpayKey.trim() !== '') {
        // --- REAL RAZORPAY FLOW ---
        try {
          const options = {
            key: razorpayKey,
            amount: total * 100, // in paise
            currency: 'INR',
            name: 'Ovii',
            description: 'Order Payment',
            handler: async function (response) {
              console.log('[Razorpay Payment Success Response]', response)
              setIsProcessing(true)
              try {
                // Insert into Supabase
                const order = await dbService.createOrder({
                  ...formData,
                  items: cart,
                  total: total,
                  payment_method: 'Razorpay',
                  payment_status: 'Paid'
                })
                setOrderId(order.id)
                setIsProcessing(false)
                setShowReceipt(true)
                
                // Trigger WhatsApp Notification
                await notificationService.sendWhatsAppAlert(order.id, total, cart, formData.name)
              } catch (err) {
                console.error(err)
                alert('Payment succeeded but logging your order failed. Please contact hello@beautyinstem.com.')
                setIsProcessing(false)
              }
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: '#204e4a'
            },
            modal: {
              ondismiss: function () {
                console.log('[Razorpay dismissed by customer]')
                setIsProcessing(false)
                setShowFailureRetry(true)
              }
            }
          }
          const rzp = new window.Razorpay(options)
          rzp.open()
        } catch (err) {
          console.error('[Razorpay instantiation failed]', err)
          setIsProcessing(false)
          setShowFailureRetry(true)
        }
      } else {
        // --- FALLBACK MOCK RAZORPAY DIALOG (Credentials empty) ---
        console.log('[Checkout] VITE_RAZORPAY_KEY_ID not set. Triggering simulated checkout overlay.')
        setIsProcessing(false)
        setShowPaymentModal(true)
      }
    } else {
      // --- CASH ON DELIVERY FLOW ---
      try {
        const order = await dbService.createOrder({
          ...formData,
          items: cart,
          total: total,
          payment_method: 'COD',
          payment_status: 'Pending'
        })
        setOrderId(order.id)
        setIsProcessing(false)
        setShowReceipt(true)
        
        // Trigger WhatsApp Notification
        await notificationService.sendWhatsAppAlert(order.id, total, cart, formData.name)
      } catch (err) {
        console.error(err)
        setIsProcessing(false)
        alert('Failed to place order. Please try again.')
      }
    }
  }

  // Handle Mock Payment confirmation submit
  const handlePaymentConfirmSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    try {
      // Insert completed order into Supabase/LocalStorage
      const order = await dbService.createOrder({
        ...formData,
        items: cart,
        total: total,
        payment_method: 'Razorpay',
        payment_status: 'Paid'
      })
      setOrderId(order.id)
      setIsProcessing(false)
      setShowPaymentModal(false)
      setShowReceipt(true)
      
      // Trigger WhatsApp Notification
      await notificationService.sendWhatsAppAlert(order.id, total, cart, formData.name)
    } catch (err) {
      console.error(err)
      setIsProcessing(false)
      alert('Order creation failed.')
    }
  }

  const handleReceiptClose = () => {
    clearCart()
    setCurrentPage('home')
  }

  if (cart.length === 0 && !showReceipt) {
    return (
      <div className="bg-[#FAF9F5] pt-32 pb-24 min-h-[85vh] flex flex-col justify-center items-center text-center font-voldog space-y-5 px-6">
        <div className="w-20 h-20 rounded-full bg-voldog-lime/15 text-voldog-teal flex items-center justify-center animate-pulse">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1.5 max-w-xs">
          <h3 className="font-voldog text-lg font-black text-voldog-teal uppercase tracking-tight">Your Shopping Bag is empty</h3>
          <p className="text-xs text-voldog-teal/60 font-semibold leading-relaxed">
            You need items in your shopping bag before you can proceed to the checkout layout.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('catalog')}
          className="font-voldog text-xs uppercase tracking-widest bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal px-8 py-4 rounded-full transition-all duration-350 cursor-pointer font-black shadow-sm"
        >
          Explore Catalog
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F5] text-voldog-teal font-sans min-h-screen pb-24 relative overflow-hidden">
      
      {/* Receipt View (Order Confirmed page override) */}
      {showReceipt ? (
        <div className="pt-32 pb-24 px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center space-y-8 bg-white border border-voldog-teal/10 p-8 md:p-12 rounded-[2.5rem] shadow-xl animate-fade-in font-voldog">
            <div className="w-16 h-16 rounded-full bg-voldog-lime/20 text-voldog-teal flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8 stroke-[2]" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-voldog text-2xl md:text-3xl font-black text-voldog-teal uppercase tracking-tight leading-none">Order Confirmed!</h1>
              <p className="text-xs text-voldog-teal/60 font-semibold leading-relaxed px-4">
                Thank you for shopping with OVII. Your luxury botanical perfumes are being prepared with care in our Jaipur atelier.
              </p>
            </div>

            <div className="bg-[#FAF9F5]/70 border border-voldog-teal/10 p-6 rounded-2xl text-left space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between font-mono">
                <span className="text-voldog-teal/50 uppercase tracking-wide">Order ID:</span>
                <span className="font-black text-voldog-teal">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-voldog-teal/50 uppercase tracking-wide">Payment Status:</span>
                <span className="font-black text-voldog-teal uppercase">Paid & Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-voldog-teal/50 uppercase tracking-wide">Method:</span>
                <span className="font-black text-voldog-teal uppercase">{paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery (COD)'}</span>
              </div>
              <div className="flex justify-between border-t border-voldog-teal/5 pt-3">
                <span className="text-voldog-teal/50 uppercase tracking-wide">Deliver To:</span>
                <span className="text-right text-voldog-teal leading-tight">
                  <span className="font-black block">{formData.name}</span>
                  <span className="text-[11px] block mt-0.5 text-voldog-teal/80">
                    {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                  </span>
                </span>
              </div>
              <div className="flex justify-between border-t border-voldog-teal/5 pt-3 text-sm font-black">
                <span className="text-voldog-teal uppercase tracking-wider">Amount Paid:</span>
                <span className="text-[#D0523C] text-base">₹{total}.00</span>
              </div>
            </div>

            <button
              onClick={handleReceiptClose}
              className="w-full bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal py-4.5 rounded-full text-xs uppercase tracking-widest font-black transition-all duration-300 cursor-pointer shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. TOP HEADER AREA (Cream background) */}
          <section className="bg-[#FAF9F5] pt-32 pb-40 px-6 md:px-12 select-none text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Centered Breadcrumbs */}
              <div className="flex justify-center items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-voldog-teal/40 font-voldog">
                <button onClick={() => setCurrentPage('home')} className="hover:text-voldog-teal cursor-pointer transition-colors">Home</button>
                <span>›</span>
                <button onClick={() => setCurrentPage('catalog')} className="hover:text-voldog-teal cursor-pointer transition-colors">Products</button>
                <span>›</span>
                <span className="text-voldog-teal">Checkout</span>
              </div>

              {/* Title */}
              <h1 className="font-voldog text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-voldog-teal uppercase tracking-tight leading-[1.3]">
                CHECKOUT
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-voldog-teal/70 max-w-2xl mx-auto font-bold leading-[1.5] font-voldog">
                You are just one step away from your bespoke botanical scent signature.
              </p>

              {/* Return link */}
              <div className="pt-2">
                <button 
                  onClick={() => setCurrentPage('catalog')}
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-voldog-teal/60 hover:text-voldog-teal transition-colors group cursor-pointer font-black font-voldog"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Return to Catalog</span>
                </button>
              </div>

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

          {/* 3. MAIN FORM SECTION */}
          <section className="relative z-20 px-6 md:px-12 select-none -mt-24 md:-mt-32">
            <div className="max-w-7xl mx-auto">

              {/* Failure/Retry Warning Banner */}
              {showFailureRetry && (
                <div className="max-w-7xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 text-xs px-5 py-4 rounded-2xl flex justify-between items-center gap-2 font-semibold">
                  <span>⚠️ Payment failed or was cancelled. Please try payment again or select Cash on Delivery.</span>
                  <button 
                    onClick={() => setShowFailureRetry(false)} 
                    className="font-bold underline uppercase tracking-wider text-[10px] hover:text-red-900 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Form Details Card */}
                <form onSubmit={handlePlaceOrderSubmit} className="lg:col-span-7 space-y-8 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_15px_45px_rgba(32,78,74,0.04)] border border-voldog-teal/5 font-voldog text-left">
                  
                  {/* Shipping Details */}
                  <div className="space-y-6">
                    <h3 className="font-voldog text-lg font-black text-voldog-teal pb-3 border-b border-voldog-teal/10 uppercase tracking-wider">Shipping Address</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">Full Name *</label>
                      <input 
                        id="name"
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Jane Doe" 
                        className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">Email Address *</label>
                        <input 
                          id="email"
                          type="email" 
                          required 
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="jane@example.com" 
                          className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">Phone Number *</label>
                        <input 
                          id="phone"
                          type="tel" 
                          required 
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="9999999999" 
                          className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">Delivery Address *</label>
                      <input 
                        id="address"
                        type="text" 
                        required 
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder="Apartment, Street Name, Locality" 
                        className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="pincode" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">Pincode *</label>
                        <input 
                          id="pincode"
                          type="text" 
                          required 
                          value={formData.pincode}
                          onChange={handleFormChange}
                          placeholder="302001" 
                          className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">City *</label>
                        <input 
                          id="city"
                          type="text" 
                          required 
                          value={formData.city}
                          onChange={handleFormChange}
                          placeholder="Jaipur" 
                          className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-[10px] uppercase tracking-widest text-voldog-teal/50 font-black block">State *</label>
                        <input 
                          id="state"
                          type="text" 
                          required 
                          value={formData.state}
                          onChange={handleFormChange}
                          placeholder="Rajasthan" 
                          className="w-full bg-[#FAF9F5]/70 border border-voldog-teal/10 focus:border-voldog-teal rounded-[1.5rem] px-6 py-4 text-sm font-semibold focus:outline-none text-voldog-teal placeholder-voldog-teal/40 transition-colors font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-6 pt-4">
                    <h3 className="font-voldog text-lg font-black text-voldog-teal pb-3 border-b border-voldog-teal/10 uppercase tracking-wider">Payment Option</h3>
                    
                    <div className="space-y-4">
                      
                      {/* Razorpay Option */}
                      <label 
                        className={`flex items-center justify-between p-5 border rounded-[1.5rem] cursor-pointer transition-all duration-350 select-none ${
                          paymentMethod === 'razorpay'
                            ? 'border-voldog-teal bg-voldog-lime/10 shadow-xs'
                            : 'border-voldog-teal/15 hover:border-voldog-teal/40 bg-[#FAF9F5]/30'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input 
                            type="radio" 
                            name="payment"
                            checked={paymentMethod === 'razorpay'}
                            onChange={() => setPaymentMethod('razorpay')}
                            className="accent-voldog-teal w-4 h-4 cursor-pointer"
                          />
                          <div className="text-left">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-voldog-teal block">Pay Online via Razorpay</span>
                            <span className="block text-[10px] text-voldog-teal/50 font-bold mt-1 font-sans">UPI, Cards, Netbanking (Test Mode Enabled)</span>
                          </div>
                        </div>
                        <CreditCard className="w-5 h-5 text-voldog-teal/60 shrink-0" />
                      </label>

                      {/* COD Option */}
                      <label 
                        className={`flex items-center justify-between p-5 border rounded-[1.5rem] cursor-pointer transition-all duration-350 select-none ${
                          paymentMethod === 'cod'
                            ? 'border-voldog-teal bg-voldog-lime/10 shadow-xs'
                            : 'border-voldog-teal/15 hover:border-voldog-teal/40 bg-[#FAF9F5]/30'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <input 
                            type="radio" 
                            name="payment"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="accent-voldog-teal w-4 h-4 cursor-pointer"
                          />
                          <div className="text-left">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-voldog-teal block">Cash on Delivery (COD)</span>
                            <span className="block text-[10px] text-voldog-teal/50 font-bold mt-1 font-sans">Pay in cash upon doorstep delivery</span>
                          </div>
                        </div>
                        <Truck className="w-5 h-5 text-voldog-teal/60 shrink-0" />
                      </label>

                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-voldog-lime hover:bg-voldog-teal hover:text-white text-voldog-teal py-4.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md flex justify-center items-center cursor-pointer font-voldog"
                    >
                      {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-voldog-teal border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <span>{paymentMethod === 'razorpay' ? 'Proceed to Online Payment' : 'Confirm COD Order'}</span>
                      )}
                    </button>
                  </div>

                </form>

                {/* Right Column: Order Summary Sidebar */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 font-voldog">
                  <div className="bg-white border border-voldog-teal/5 p-6 md:p-8 rounded-[2.5rem] space-y-6 shadow-[0_15px_45px_rgba(32,78,74,0.04)]">
                    <h3 className="font-voldog text-lg font-black text-voldog-teal pb-3 border-b border-voldog-teal/10 uppercase tracking-wider text-left">Order Summary</h3>
                    
                    {/* Cart Items List */}
                    <div className="divide-y divide-voldog-teal/5 max-h-72 overflow-y-auto pr-2 no-scrollbar">
                      {cart.map((item) => (
                        <div key={item.cartId} className="flex justify-between py-4.5 items-center text-xs font-semibold">
                          <div className="text-left space-y-1">
                            <span className="font-extrabold text-voldog-teal uppercase tracking-tight block">{item.name}</span>
                            <span className="text-[9px] font-black text-voldog-teal/40 uppercase tracking-widest block">{item.size} • Qty: {item.quantity}</span>
                          </div>
                          <span className="font-black text-voldog-teal shrink-0">₹{item.price * item.quantity}.00</span>
                        </div>
                      ))}
                    </div>

                    {/* Calculations */}
                    <div className="space-y-3.5 border-t border-voldog-teal/10 pt-5 text-xs font-bold text-voldog-teal/70">
                      <div className="flex justify-between">
                        <span className="uppercase tracking-wider">Bag Subtotal</span>
                        <span>₹{subtotal}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="uppercase tracking-wider">Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `₹${shipping}.00`}</span>
                      </div>
                      
                      {shipping > 0 && (
                        <div className="text-right text-[10px] text-voldog-teal/40 font-bold italic mt-0.5">
                          Add ₹{1000 - subtotal} more for free shipping
                        </div>
                      )}

                      <div className="flex justify-between border-t border-voldog-teal/5 pt-4 text-sm font-black text-voldog-teal">
                        <span className="uppercase tracking-widest">Total Amount</span>
                        <span className="text-[#D0523C] text-base">₹{total}.00</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2.5 text-[10px] text-voldog-teal/40 font-bold leading-relaxed uppercase tracking-wider text-left pt-2">
                      <ShieldCheck className="w-5 h-5 text-voldog-teal/30 flex-shrink-0" />
                      <span>Your order is covered by our 100% satisfaction botanical replacement guarantee.</span>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </section>
        </>
      )}

      {/* --- FALLBACK MOCK RAZORPAY MODAL POPUP --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#204e4a]/60 backdrop-blur-md animate-fade-in" />
          
          <div className="relative bg-white text-gray-800 rounded-[2rem] max-w-sm w-full overflow-hidden shadow-2xl animate-fade-in border border-voldog-teal/10">
            {/* Razorpay Header */}
            <div className="bg-[#172554] text-white p-4.5 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 bg-[#0c81eb] rounded-md flex items-center justify-center font-bold text-sm">R</div>
                <div className="text-left">
                  <h3 className="font-bold text-sm leading-tight">Razorpay Secure</h3>
                  <p className="text-[9px] text-blue-200">OVII Checkout (Test Mode Enabled)</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPaymentModal(false)
                  setShowFailureRetry(true)
                }} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Merchant info */}
            <div className="bg-gray-50 border-b border-gray-100 px-5 py-3.5 flex justify-between items-center text-xs">
              <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Order Subtotal</span>
              <span className="font-black text-gray-900 text-sm">₹{total}.00</span>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentConfirmSubmit} className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 block text-left">Payment Option</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRazorpayMethod('upi')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      razorpayMethod === 'upi'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <span className="text-[11px] font-black">UPI ID</span>
                    <span className="text-[8px] font-normal opacity-70">GPay, PhonePe, UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRazorpayMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      razorpayMethod === 'card'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[8px] font-normal opacity-70">Credit/Debit Card</span>
                  </button>
                </div>
              </div>

              {razorpayMethod === 'upi' ? (
                <div className="space-y-2 text-left">
                  <label htmlFor="upiId" className="text-xs font-bold text-gray-600 uppercase tracking-wide">Enter UPI ID</label>
                  <input
                    id="upiId"
                    type="text"
                    required
                    placeholder="oviiperfume@upi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <div className="space-y-1">
                    <label htmlFor="cardNum" className="text-xs font-bold text-gray-600 uppercase tracking-wide">Card Number</label>
                    <input
                      id="cardNum"
                      type="text"
                      required
                      placeholder="4111 2222 3333 4444"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="expiry" className="text-xs font-bold text-gray-600 uppercase tracking-wide">Expiry (MM/YY)</label>
                      <input
                        id="expiry"
                        type="text"
                        required
                        placeholder="08/29"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="cvv" className="text-xs font-bold text-gray-600 uppercase tracking-wide">CVV</label>
                      <input
                        id="cvv"
                        type="password"
                        required
                        maxLength="3"
                        placeholder="***"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* simulated payment errors trigger */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-[#0c81eb] hover:bg-[#0b75d5] text-white py-3.5 rounded-full font-bold text-xs transition-colors shadow-sm cursor-pointer text-center"
                >
                  Pay Successful
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false)
                    setShowFailureRetry(true)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-bold text-xs transition-colors shadow-sm cursor-pointer text-center"
                >
                  Trigger Failure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
