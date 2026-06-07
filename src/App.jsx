import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import CtaBanner from './components/CtaBanner'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Catalog from './pages/Catalog'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { useStore } from './store'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function App() {
  const { currentPage, setCurrentPage, selectedProductId, setSelectedProductId, fetchProducts } = useStore()

  const [activePage, setActivePage] = React.useState(currentPage)
  const [activeProductId, setActiveProductId] = React.useState(selectedProductId)
  const overlayRef = React.useRef(null)
  const logoRef = React.useRef(null)

  // 0. Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    let rafId
    const tick = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      gsap.ticker.remove(updateTicker)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  // Scroll to top on page change and refresh ScrollTriggers
  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
    return () => clearTimeout(timer)
  }, [activePage])

  // 1. Initial product fetch on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // 2. Sync browser URL on load and handle popstate (back/forward)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname
      if (path === '/admin') {
        setCurrentPage('admin')
      } else if (path === '/catalog') {
        setCurrentPage('catalog')
      } else if (path === '/checkout') {
        setCurrentPage('checkout')
      } else if (path === '/contact') {
        setCurrentPage('contact')
      } else if (path.startsWith('/product')) {
        setCurrentPage('product')
        const parts = path.split('/')
        if (parts[2]) {
          setSelectedProductId(parts[2])
        }
      } else {
        setCurrentPage('home')
      }
    }

    // Run on mount to check initial URL path
    handleLocationChange()

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [setCurrentPage, setSelectedProductId])

  // 3. Update browser URL pathname when state changes inside the app
  useEffect(() => {
    const currentPath = window.location.pathname
    let targetPath = '/'
    if (currentPage === 'admin') {
      targetPath = '/admin'
    } else if (currentPage === 'catalog') {
      targetPath = '/catalog'
    } else if (currentPage === 'checkout') {
      targetPath = '/checkout'
    } else if (currentPage === 'contact') {
      targetPath = '/contact'
    } else if (currentPage === 'product') {
      targetPath = `/product/${selectedProductId}`
    }

    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath)
    }
  }, [currentPage, selectedProductId])

  // Handle page transitions with GSAP curtain overlay
  const isFirstRender = React.useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (currentPage === activePage && selectedProductId === activeProductId) {
      return
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    })

    // Prepare overlay state
    gsap.set(overlayRef.current, {
      yPercent: 100,
      opacity: 1,
      display: 'flex'
    })
    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.8
    })

    // Transition Animation Sequence
    tl.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.5
    })
    .to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: 'back.out(1.5)'
    }, '-=0.1')
    .add(() => {
      setActivePage(currentPage)
      setActiveProductId(selectedProductId)
    })
    .to(logoRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 0.25,
      delay: 0.15
    })
    .to(overlayRef.current, {
      yPercent: -100,
      duration: 0.5
    })
    .set(overlayRef.current, {
      display: 'none'
    })

    return () => {
      tl.kill()
    }
  }, [currentPage, selectedProductId, activePage, activeProductId])

  // Dynamic Page Routing
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />
      case 'catalog':
        return <Catalog />
      case 'product':
        return <ProductDetail productId={activeProductId} />
      case 'checkout':
        return <Checkout />
      case 'contact':
        return <Contact />
      case 'admin':
        return <Admin />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal overflow-x-hidden selection:bg-brand-gold/25 selection:text-brand-charcoal">
      {/* Navigation Header */}
      {activePage !== 'admin' && <Navbar activePage={activePage} />}

      {/* Main Content Area */}
      <main className="flex-grow animate-fade-in">
        {renderPage()}
      </main>

      {/* Footer Details */}
      {activePage !== 'admin' && <CtaBanner />}

      {/* Shopping Cart Drawer Sidebar */}
      <CartDrawer />

      {/* Premium GSAP Page Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] bg-[#204e4a] flex flex-col items-center justify-center pointer-events-auto"
        style={{ display: 'none', transform: 'translateY(100%)' }}
      >
        <div ref={logoRef} className="flex flex-col items-center space-y-4">
          <span className="font-voldog font-black text-6xl tracking-[0.25em] text-[#dbff37] select-none">
            OVII
          </span>
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold select-none">
            Botanical Perfume House
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
