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
  }, [currentPage])

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

  // Dynamic Page Routing
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'catalog':
        return <Catalog />
      case 'product':
        return <ProductDetail />
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
      {currentPage !== 'admin' && <Navbar />}

      {/* Main Content Area */}
      <main className="flex-grow animate-fade-in">
        {renderPage()}
      </main>

      {/* Footer Details */}
      {currentPage !== 'admin' && <CtaBanner />}

      {/* Shopping Cart Drawer Sidebar */}
      <CartDrawer />
    </div>
  )
}

export default App
