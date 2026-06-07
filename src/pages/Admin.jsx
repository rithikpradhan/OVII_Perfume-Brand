import React, { useState, useEffect, useMemo } from 'react'
import { useStore } from '../store'
import { supabase } from '../services/supabase'
import { 
  LayoutDashboard, ShoppingBag, Users, BarChart3, MessageSquare, 
  Package, Settings, HelpCircle, Search, Moon, Bell, ChevronDown, 
  LogOut, RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, X, 
  Calendar, Check, ShieldAlert, FileText, DollarSign 
} from 'lucide-react'

// Safe parsing helper to protect against invalid/old order schemas crashing the render loop
const safeParseItems = (items) => {
  if (Array.isArray(items)) return items
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items)
      if (Array.isArray(parsed)) return parsed
      if (parsed && typeof parsed === 'object') return [parsed]
      return []
    } catch (e) {
      console.error('Error parsing order items:', e)
      // Fallback for raw string names from older schemas
      return [{ name: items, quantity: 1, price: 0, size: 'Tin' }]
    }
  }
  if (items && typeof items === 'object') return [items]
  return []
}

export default function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'orders' | 'products' | 'messages' | 'settings' | 'customers' | 'overview'
  const [searchTerm, setSearchTerm] = useState('')
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [localFiles, setLocalFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    price8g: '',
    price15g: '',
    scent: '',
    family: 'Floral',
    description: '',
    image: '',
    images: [],
    isBestSeller: false,
    isNew: false,
    intensity: 3,
    isVisible: true
  })

  // Delete Confirm State
  const [productToDelete, setProductToDelete] = useState(null)

  // Zustand Store binding
  const {
    orders,
    isLoadingOrders,
    fetchOrders,
    updateOrderStatus,
    updateOrderPaymentStatus,
    products,
    isLoadingProducts,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    messages,
    isLoadingMessages,
    fetchMessages,
    uploadFile
  } = useStore()

  // Handle Auth Session check and listeners
  useEffect(() => {
    let subscription = null

    const initAuth = async () => {
      if (supabase) {
        // 1. Check current session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }

        // 2. Set up auth listener
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
          }
        })
        subscription = data.subscription
      } else {
        // LocalStorage fallback auth check
        const mockAuth = localStorage.getItem('ovii_admin_auth') === 'true'
        setIsAuthenticated(mockAuth)
      }
      setIsLoadingAuth(false)
    }

    initAuth()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Fetch all databases when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
      fetchProducts()
      fetchMessages()
    }
  }, [isAuthenticated, fetchOrders, fetchProducts, fetchMessages])

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setIsLoadingAuth(true)

    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        })
        if (error) throw error
        setIsAuthenticated(true)
      } else {
        // LocalStorage Fallback Authentication
        const defaultEmail = 'admin@beautyinstem.com'
        const defaultPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'stemadmin2026'
        if (email.trim() === defaultEmail && password === defaultPassword) {
          localStorage.setItem('ovii_admin_auth', 'true')
          setIsAuthenticated(true)
        } else {
          throw new Error('Invalid email or password.')
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.')
      setIsAuthenticated(false)
    } finally {
      setIsLoadingAuth(false)
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut()
      } else {
        localStorage.removeItem('ovii_admin_auth')
        setIsAuthenticated(false)
      }
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error('Logout error:', err)
      setIsAuthenticated(false)
    }
  }

  // Handle Order Status Switcher
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  // Handle Order Payment Status Switcher
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await updateOrderPaymentStatus(orderId, newPaymentStatus)
    } catch (err) {
      alert('Failed to update payment status.')
    }
  }

  // Open Product Modal for Add
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      price: '',
      price8g: '',
      price15g: '',
      scent: '',
      family: 'Floral',
      description: '',
      image: '',
      images: [],
      isBestSeller: false,
      isNew: false,
      intensity: 3,
      isVisible: true
    })
    setLocalFiles([])
    setIsProductModalOpen(true)
  }

  // Open Product Modal for Edit
  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price,
      price8g: product.price8g || '',
      price15g: product.price15g || '',
      scent: product.scent || '',
      family: product.family || 'Floral',
      description: product.description || '',
      image: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      isBestSeller: !!product.isBestSeller,
      isNew: !!product.isNew,
      intensity: product.intensity || 3,
      isVisible: product.isVisible !== false
    })
    setLocalFiles([])
    setIsProductModalOpen(true)
  }

  // Toggle Visibility directly from table row
  const handleToggleVisibility = async (product) => {
    try {
      await updateProduct(product.id, {
        ...product,
        isVisible: !product.isVisible
      })
    } catch (err) {
      alert('Failed to update visibility.')
    }
  }

  // Handle Product Form Submit (Create/Update)
  const handleProductFormSubmit = async (e) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price) {
      alert('Name and Base Price are required.')
      return
    }

    if ((productForm.images || []).length === 0 && localFiles.length === 0) {
      alert('At least one product image is required (upload files or add a URL).')
      return
    }

    setIsUploading(true)

    try {
      // 1. Upload files to Storage / convert to base64
      const uploadedUrls = []
      for (const file of localFiles) {
        const url = await uploadFile(file) // Zustand action
        uploadedUrls.push(url)
      }

      // 2. Compute final images list
      const finalImagesList = [...(productForm.images || []), ...uploadedUrls]
      const mainImageUrl = finalImagesList[0] || ''

      const payload = {
        ...productForm,
        price: Number(productForm.price),
        price8g: productForm.price8g ? Number(productForm.price8g) : null,
        price15g: productForm.price15g ? Number(productForm.price15g) : null,
        intensity: Number(productForm.intensity),
        image: mainImageUrl,
        images: finalImagesList
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await addProduct(payload)
      }

      setLocalFiles([])
      setIsProductModalOpen(false)
    } catch (err) {
      console.error(err)
      const errorMsg = err.message || (typeof err === 'string' ? err : 'Unknown error')
      alert(`Failed to save product details: ${errorMsg}\n\nPlease make sure your "product-images" storage bucket is created in Supabase and has public upload (anon INSERT) policies enabled.`)
    } finally {
      setIsUploading(false)
    }
  }

  // Confirm Product Deletion
  const handleDeleteProductConfirm = async () => {
    if (!productToDelete) return
    try {
      await deleteProduct(productToDelete.id)
      setProductToDelete(null)
    } catch (err) {
      alert('Failed to delete product.')
    }
  }

  // --- DYNAMIC ANALYTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalSales = (orders || []).reduce((sum, order) => sum + (order ? order.total : 0), 0)
    
    // Total items sold
    let totalItems = 0
    ;(orders || []).forEach(order => {
      if (!order) return
      const itemsList = safeParseItems(order.items)
      itemsList.forEach(item => {
        if (item && item.quantity) {
          totalItems += item.quantity
        }
      })
    })

    return {
      totalSales,
      totalOrders: (orders || []).length,
      totalItems,
      totalRevenue: totalSales
    }
  }, [orders])

  // --- TOP SELLING PRODUCTS CALCULATOR ---
  const topSellingProducts = useMemo(() => {
    const counts = {}
    ;(products || []).forEach(p => {
      if (p && p.name) {
        counts[p.name] = { sales: 0, earnings: 0, product: p }
      }
    })

    ;(orders || []).forEach(order => {
      if (!order) return
      const itemsList = safeParseItems(order.items)

      itemsList.forEach(item => {
        if (!item || !item.name) return
        if (counts[item.name]) {
          counts[item.name].sales += item.quantity || 1
          counts[item.name].earnings += (item.quantity || 1) * (item.price || 0)
        } else {
          // fallback
          counts[item.name] = {
            sales: item.quantity || 1,
            earnings: (item.quantity || 1) * (item.price || 0),
            product: { name: item.name, image: item.image || '', isVisible: true, family: 'Floral' }
          }
        }
      })
    })

    // Sort by sales descending and return top 4
    return Object.values(counts)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4)
  }, [products, orders])

  // --- RECENT ORDERS SLICE ---
  const recentOrders = useMemo(() => {
    return (orders || []).slice(0, 5)
  }, [orders])

  // --- UNIQUE CUSTOMERS CALCULATOR ---
  const uniqueCustomers = useMemo(() => {
    const customersMap = {}
    ;(orders || []).forEach(order => {
      if (!order) return
      const key = order.email || order.phone || order.customer_name
      if (!key) return
      if (!customersMap[key]) {
        customersMap[key] = {
          name: order.customer_name,
          email: order.email || 'N/A',
          phone: order.phone || 'N/A',
          address: order.address,
          ordersCount: 0,
          totalSpent: 0
        }
      }
      customersMap[key].ordersCount += 1
      customersMap[key].totalSpent += order.total
    })
    return Object.values(customersMap)
  }, [orders])

  // --- SEARCH FILTERS ---
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders || []
    return (orders || []).filter(order => 
      order && (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
  }, [orders, searchTerm])

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products || []
    return (products || []).filter(prod => 
      prod && (
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.family && prod.family.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
  }, [products, searchTerm])

  const filteredMessages = useMemo(() => {
    if (!searchTerm.trim()) return messages || []
    return (messages || []).filter(msg => 
      msg && (
        msg.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [messages, searchTerm])

  // Clear search on tab switch
  useEffect(() => {
    setSearchTerm('')
  }, [activeTab])

  // --- Loading Auth State ---
  if (isLoadingAuth) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen flex justify-center items-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    )
  }

  // --- PASS PASSWORD PROMPT VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="bg-[#F8F9FA] pt-28 pb-24 min-h-screen flex justify-center items-center font-sans px-6">
        <div className="relative bg-white border border-[#E5E7EB] p-8 rounded-xl shadow-xl max-w-sm w-full space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-5 h-5" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">Admin Portal Access</h1>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Sign in with your email and password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@beautyinstem.com" 
                className="w-full bg-[#F3F4F6] border border-[#E5E7EB] hover:border-gray-300 focus:border-indigo-500 rounded-lg px-4 py-3 text-xs focus:outline-none text-gray-800 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-[#F3F4F6] border border-[#E5E7EB] hover:border-gray-300 focus:border-indigo-500 rounded-lg px-4 py-3 text-xs focus:outline-none text-gray-800 transition-colors"
              />
            </div>

            {authError && (
              <p className="text-[10px] text-red-600 font-medium text-center pt-1">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-xs uppercase tracking-widest transition-all duration-300 font-semibold cursor-pointer shadow-md text-center"
            >
              Log In
            </button>
          </form>
          
          <p className="text-[9px] text-gray-400 font-mono text-center">
            {supabase 
              ? "Using live Supabase Auth. Create users in dashboard." 
              : "Demo fallback credentials: admin@beautyinstem.com / stemadmin2026"}
          </p>
        </div>
      </div>
    )
  }

  // --- FULL LOGGED REDESIGNED PORTAL VIEW ---
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-800 overflow-x-hidden">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
        <div>
          {/* Sidebar Header Brand */}
          <div className="p-6 flex items-center space-x-3 border-b border-[#E5E7EB]">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              B
            </div>
            <span className="font-bold text-lg tracking-wide text-gray-900">Stem Admin</span>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <span className="px-3 text-[9px] uppercase tracking-widest font-semibold text-gray-400 block mb-2.5">Menu</span>
            
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </button>

            {/* Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'orders'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Orders</span>
            </button>

            {/* Customers */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'customers'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Customers</span>
            </button>

            {/* Overview / Analytics */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'overview'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>Overview</span>
            </button>

            {/* Message */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'messages'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Message</span>
            </button>

            {/* Products */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'products'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Package className="w-4.5 h-4.5" />
              <span>Products</span>
            </button>
          </div>

          <div className="p-4 pt-0 space-y-1">
            <div className="border-t border-[#E5E7EB] my-3"></div>
            
            {/* Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'settings'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Settings</span>
            </button>

            {/* Help Center */}
            <button
              onClick={() => alert('Support details coming soon!')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4.5 h-4.5" />
              <span>Help Center</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase">
              OM
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[10px] font-semibold text-gray-900">Stem Manager</span>
              <span className="block text-[8px] text-gray-400">Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN SECTION */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP NAVBAR */}
        <header className="bg-white border-b border-[#E5E7EB] h-16 flex items-center justify-between px-8 z-10 sticky top-0 shrink-0">
          {/* Top Bar Search Input */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none text-gray-800 transition-colors"
            />
          </div>

          {/* Top Bar Right Options */}
          <div className="flex items-center space-x-4">
            {/* Quick Back to shop */}
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault()
                window.history.pushState(null, '', '/')
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
              className="text-[10px] uppercase tracking-wider text-indigo-600 hover:text-indigo-700 bg-indigo-50 font-bold px-3.5 py-2 rounded-lg transition-colors"
            >
              Shop
            </a>

            {/* Dark mode toggle */}
            <button 
              onClick={() => alert('Dark mode coming soon!')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Moon className="w-4.5 h-4.5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="border-l border-[#E5E7EB] h-5"></div>

            {/* Profile capsule */}
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                alt="Profile Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
              />
              <span className="text-xs font-semibold text-gray-700 hidden sm:block">Nahid Hossain</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-grow p-8 bg-[#F8F9FA] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in text-left">
              
              {/* Header Titles */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                {/* Range date selector */}
                <div className="flex items-center space-x-2 bg-white border border-[#E5E7EB] px-3.5 py-2 rounded-lg text-xs font-medium text-gray-600 shadow-xs">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>May-Nov 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>

              {/* Four Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Total Sales */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Sales</span>
                    <span className="text-2xl font-bold text-gray-900 block">₹{stats.totalSales}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Orders</span>
                    <span className="text-2xl font-bold text-gray-900 block">{stats.totalOrders}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. Total Items */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Items</span>
                    <span className="text-2xl font-bold text-gray-900 block">{stats.totalItems}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. Total Revenue */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex items-center justify-between shadow-xs hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Revenue</span>
                    <span className="text-2xl font-bold text-gray-900 block">₹{stats.totalRevenue}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Main Graphs Grid: Analytic chart & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sale Analytics curve chart */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 rounded-xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-gray-900">Sale Analytic</h3>
                    <div className="flex items-center space-x-4 text-xs font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                        <span className="text-gray-500">May</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                        <span className="text-gray-500">June</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-gray-600 shadow-xs">
                        <span>May-Jun 2026</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart area */}
                  <div className="h-64 w-full relative">
                    <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Horizontal Grid lines */}
                      <line x1="40" y1="40" x2="580" y2="40" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="90" x2="580" y2="90" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="140" x2="580" y2="140" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="190" x2="580" y2="190" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="40" y1="240" x2="580" y2="240" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Green Curve */}
                      <path d="M 40,210 C 130,210 180,60 270,70 C 360,80 410,180 500,140 C 540,120 560,110 580,120" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 40,210 C 130,210 180,60 270,70 C 360,80 410,180 500,140 C 540,120 560,110 580,120 L 580,240 L 40,240 Z" fill="url(#gradient-green)" />

                      {/* Blue Curve */}
                      <path d="M 40,180 C 130,180 180,140 270,155 C 360,170 410,110 500,170 C 540,195 560,205 580,200" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 40,180 C 130,180 180,140 270,155 C 360,170 410,110 500,170 C 540,195 560,205 580,200 L 580,240 L 40,240 Z" fill="url(#gradient-blue)" />

                      {/* Active Markers */}
                      <circle cx="270" cy="70" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="500" cy="170" r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />

                      {/* Tooltip labels */}
                      <g transform="translate(240, 15)">
                        <rect width="60" height="24" rx="4" fill="#1E293B" />
                        <text x="30" y="15" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontWeight="bold">Max Gain 610</text>
                      </g>
                      <line x1="270" y1="40" x2="270" y2="70" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />

                      <g transform="translate(470, 205)">
                        <rect width="60" height="24" rx="4" fill="#1E293B" />
                        <text x="30" y="15" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontWeight="bold">Max Gain 299</text>
                      </g>
                      <line x1="500" y1="170" x2="500" y2="240" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 2" />

                      {/* Months on X-Axis */}
                      <text x="40" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Jan</text>
                      <text x="130" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Mar</text>
                      <text x="270" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Jul</text>
                      <text x="410" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Sep</text>
                      <text x="500" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Nov</text>
                      <text x="580" y="262" fill="#9CA3AF" fontSize="9" textAnchor="middle">Dec</text>
                    </svg>
                  </div>
                </div>

                {/* Recent Orders Widget */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-900">Order Recently</h3>
                  </div>

                  <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                    {recentOrders.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-gray-400">
                        No transactions logged yet.
                      </div>
                    ) : (
                      recentOrders.map((order, idx) => {
                        if (!order) return null
                        const itemsList = safeParseItems(order.items)
                        const firstItem = itemsList[0] || { name: 'Item', price: order.total, size: 'Tin', image: '' }
                        const totalQuantity = itemsList.reduce((sum, i) => sum + (i ? (i.quantity || 1) : 0), 0)

                        return (
                          <div key={order.id || idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg border border-[#E5E7EB] overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                <img 
                                  src={firstItem.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=100'} 
                                  alt={firstItem.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-left leading-tight">
                                <span className="block text-xs font-semibold text-gray-900 truncate max-w-[120px]">{firstItem.name}</span>
                                <span className="block text-[10px] text-gray-400">{firstItem.size || 'Tin'}</span>
                              </div>
                            </div>

                            <div className="text-right leading-tight flex flex-col items-end">
                              <span className="block text-xs font-bold text-emerald-500 font-sans">₹{order.total}</span>
                              <span className={`inline-block text-[8px] px-1 py-0.5 rounded-xs font-bold mt-1 uppercase ${
                                order.payment_method?.toLowerCase() === 'razorpay'
                                  ? 'bg-blue-50 text-blue-500 border border-blue-100'
                                  : 'bg-amber-50 text-amber-500 border border-amber-100'
                              }`}>
                                {order.payment_method || 'COD'}
                              </span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full py-2 border border-[#E5E7EB] hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 transition-colors mt-5 cursor-pointer block text-center"
                  >
                    View All
                  </button>
                </div>

              </div>

              {/* Bottom Grid: Top Selling Products & Monthly Profits */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Selling Products table */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 rounded-xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-gray-900">Top Selling Products</h3>
                    <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-lg text-[10px] font-medium text-gray-600 shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Nov 2026</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E5E7EB] text-gray-400 font-semibold uppercase tracking-wider text-[9px] pb-2">
                          <th className="py-2.5 w-6">
                            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 w-3.5 h-3.5" disabled />
                          </th>
                          <th className="py-2.5">Product</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5">Sales</th>
                          <th className="py-2.5 text-right">Earning</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {topSellingProducts.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-10 text-center text-xs text-gray-400">
                              No product sales tracked yet.
                            </td>
                          </tr>
                        ) : (
                          topSellingProducts.map((stat, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 w-3.5 h-3.5 cursor-pointer" />
                              </td>
                              <td className="py-3 flex items-center space-x-3">
                                <div className="w-8 h-8 rounded border border-[#E5E7EB] overflow-hidden bg-gray-50 shrink-0">
                                  <img 
                                    src={stat.product.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=100'} 
                                    alt={stat.product.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-semibold text-gray-900 truncate max-w-[150px]">{stat.product.name}</span>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                                  stat.product.isVisible !== false
                                    ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200'
                                }`}>
                                  {stat.product.isVisible !== false ? 'Live' : 'Draft'}
                                </span>
                              </td>
                              <td className="py-3 font-semibold text-gray-900">{stat.sales}</td>
                              <td className="py-3 text-right font-bold text-gray-900">₹{stat.earnings}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Monthly Profits donut widget */}
                <div className="bg-white border border-[#E5E7EB] p-6 rounded-xl flex flex-col shadow-xs justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-900">Monthly Profits</h3>
                    <button className="text-gray-400 hover:text-gray-600 text-lg">•••</button>
                  </div>

                  {/* SVG Donut Chart */}
                  <div className="relative flex items-center justify-center py-4">
                    <svg viewBox="0 0 200 200" className="w-40 h-40">
                      {/* Base Grey circle */}
                      <circle cx="100" cy="100" r="70" fill="transparent" stroke="#F3F4F6" strokeWidth="18" />
                      
                      {/* Segment 1: Online distribution (say 65% = 285.8 out of 439.8 circumference) */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="70" 
                        fill="transparent" 
                        stroke="#3B82F6" 
                        strokeWidth="18" 
                        strokeDasharray="285.8 154" 
                        strokeDashoffset="0" 
                        transform="rotate(-90 100 100)" 
                        strokeLinecap="round" 
                      />

                      {/* Segment 2: COD distribution (say 35% = 154 circumference) */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="70" 
                        fill="transparent" 
                        stroke="#A855F7" 
                        strokeWidth="18" 
                        strokeDasharray="154 285.8" 
                        strokeDashoffset="-285.8" 
                        transform="rotate(-90 100 100)" 
                        strokeLinecap="round" 
                      />

                      {/* Inner labels */}
                      <text x="100" y="94" textAnchor="middle" fill="#9CA3AF" fontSize="10" fontWeight="500">Total Profit</text>
                      <text x="100" y="116" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="bold">₹{stats.totalRevenue}</text>
                    </svg>
                  </div>

                  {/* Bottom percentage indicators */}
                  <div className="flex justify-center space-x-6 text-[10px] font-semibold text-gray-500 pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                      <span>Online 65%</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A855F7]"></span>
                      <span>COD 35%</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ORDERS LIST DETAILS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Order Operations</h1>
                <span className="text-xs text-gray-400 font-medium">Manage transactions, customer details, and delivery statuses</span>
              </div>

              {/* Table search & refresh tools */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Order ID or Customer Name"
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none text-gray-800 transition-colors"
                  />
                </div>

                <button 
                  onClick={fetchOrders}
                  className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  <span>Sync Orders</span>
                </button>
              </div>

              {/* Orders Data Table */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-x-auto shadow-xs">
                {isLoadingOrders ? (
                  <div className="py-20 flex justify-center items-center space-x-3 text-xs text-gray-400">
                    <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Retrieving order records...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-400">
                    No orders registered in the system.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#E5E7EB] text-gray-400 font-semibold uppercase tracking-wider text-[9px] py-3.5 px-5 block md:table-row">
                        <th className="py-4 px-5">Order ID</th>
                        <th className="py-4 px-5">Customer details</th>
                        <th className="py-4 px-5">Purchased Balms</th>
                        <th className="py-4 px-5">Bill Value</th>
                        <th className="py-4 px-5">Delivery Status</th>
                        <th className="py-4 px-5">Purchased On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredOrders.map((order) => {
                        if (!order) return null
                        const itemsList = safeParseItems(order.items)

                        return (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            {/* ID */}
                            <td className="py-4 px-5 font-mono font-bold text-[11px] text-gray-900 max-w-[120px] truncate">{order.id}</td>
                            
                            {/* Customer details block */}
                            <td className="py-4 px-5 leading-tight">
                              <span className="font-semibold text-gray-900 block">{order.customer_name}</span>
                              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">{order.phone}</span>
                              {order.email && (
                                <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5 truncate max-w-[180px]">{order.email}</span>
                              )}
                              <span className="text-[9px] text-gray-400 font-sans block mt-1 leading-relaxed max-w-[200px] whitespace-normal break-words">{order.address}</span>
                            </td>

                            {/* Items List */}
                            <td className="py-4 px-5 leading-relaxed font-light">
                              {itemsList.map((item, idx) => {
                                if (!item) return null
                                return (
                                  <div key={idx} className="truncate max-w-[200px]">
                                    {item.name} <span className="text-[10px] text-indigo-500 font-medium">({item.size})</span> <span className="font-semibold text-gray-500">x{item.quantity}</span>
                                  </div>
                                )
                              })}
                            </td>

                             {/* Bill Value & Payment details */}
                             <td className="py-4 px-5 leading-tight">
                               <span className="font-bold text-gray-950 text-sm block">₹{order.total}</span>
                               <div className="flex flex-wrap gap-1 mt-1.5">
                                 <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider ${
                                   order.payment_method?.toLowerCase() === 'razorpay'
                                     ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                     : 'bg-amber-50 text-amber-600 border border-amber-100'
                                 }`}>
                                   {order.payment_method || 'COD'}
                                 </span>
                                 <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-semibold uppercase tracking-wider ${
                                   (order.payment_status || 'Pending').toLowerCase() === 'paid'
                                     ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                     : 'bg-orange-50 text-orange-600 border border-orange-100'
                                 }`}>
                                   {order.payment_status || 'Pending'}
                                 </span>
                               </div>
                             </td>

                             {/* Status Change Selector */}
                             <td className="py-4 px-5">
                               <div className="flex flex-col space-y-1.5">
                                 <select
                                   value={order.status}
                                   onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                   className={`px-2.5 py-1.5 rounded-md border text-[10px] uppercase font-bold tracking-wider bg-white cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors ${
                                     order.status === 'Delivered' ? 'border-[#10B981] text-[#10B981] bg-emerald-50/20' :
                                     order.status === 'Shipped' ? 'border-blue-400 text-blue-500 bg-blue-50/20' :
                                     order.status === 'Packed' ? 'border-orange-400 text-orange-500 bg-orange-50/20' :
                                     'border-[#C9A84C] text-[#C9A84C] bg-amber-50/20'
                                   }`}
                                 >
                                   <option value="Pending">Pending</option>
                                   <option value="Packed">Packed</option>
                                   <option value="Shipped">Shipped</option>
                                   <option value="Delivered">Delivered</option>
                                 </select>

                                 <select
                                   value={order.payment_status || 'Pending'}
                                   onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                                   className={`px-2.5 py-1.5 rounded-md border text-[10px] uppercase font-bold tracking-wider bg-white cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors ${
                                     (order.payment_status || 'Pending').toLowerCase() === 'paid'
                                       ? 'border-[#10B981] text-[#10B981] bg-emerald-50/20'
                                       : 'border-orange-400 text-orange-500 bg-orange-50/20'
                                   }`}
                                 >
                                   <option value="Pending">Pending</option>
                                   <option value="Paid">Paid</option>
                                 </select>
                               </div>
                             </td>

                            {/* Date */}
                            <td className="py-4 px-5 text-gray-400 font-light">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER DATA LOGS */}
          {activeTab === 'customers' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Customers Database</h1>
                <span className="text-xs text-gray-400 font-medium">Registered checkout accounts and customer profiles</span>
              </div>

              {/* Customers List Table */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-x-auto shadow-xs">
                {uniqueCustomers.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-400">
                    No registered customer accounts logged.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#E5E7EB] text-gray-400 font-semibold uppercase tracking-wider text-[9px]">
                        <th className="py-4 px-5">Name</th>
                        <th className="py-4 px-5">Email</th>
                        <th className="py-4 px-5">Phone Number</th>
                        <th className="py-4 px-5">Address</th>
                        <th className="py-4 px-5">Orders Count</th>
                        <th className="py-4 px-5 text-right">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {uniqueCustomers.map((cust, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-5 font-semibold text-gray-900">{cust.name}</td>
                          <td className="py-4 px-5 font-mono text-gray-600">{cust.email}</td>
                          <td className="py-4 px-5 font-mono text-gray-600">{cust.phone}</td>
                          <td className="py-4 px-5 text-gray-400 max-w-[220px] truncate" title={cust.address}>
                            {cust.address}
                          </td>
                          <td className="py-4 px-5 font-semibold text-gray-900">{cust.ordersCount}</td>
                          <td className="py-4 px-5 text-right font-bold text-emerald-500">₹{cust.totalSpent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Contact Messages</h1>
                <span className="text-xs text-gray-400 font-medium">Customer queries and contact form notifications</span>
              </div>

              {/* Search Bar messages */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search messages by name or email..."
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none text-gray-800 transition-colors"
                  />
                </div>

                <button 
                  onClick={fetchMessages}
                  className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  <span>Sync Messages</span>
                </button>
              </div>

              {/* Messages grid display */}
              {isLoadingMessages ? (
                <div className="py-20 flex justify-center items-center space-x-3 text-xs text-gray-400">
                  <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  <span>Fetching inbox...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="py-20 text-center text-xs text-gray-400 bg-white rounded-xl border border-[#E5E7EB]">
                  No incoming messages logged.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMessages.map((msg, idx) => {
                    if (!msg) return null
                    return (
                      <div key={msg.id || idx} className="bg-white border border-[#E5E7EB] p-6 rounded-xl space-y-4 shadow-xs relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="block font-bold text-gray-900 text-sm">{msg.customer_name}</span>
                              <span className="block text-[10px] text-indigo-500 font-medium font-mono">{msg.email}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(msg.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-light whitespace-pre-wrap">{msg.message}</p>
                        </div>

                        <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-[10px] text-gray-400">
                          <div className="flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            <span>Contact Query</span>
                          </div>
                          <a 
                            href={`mailto:${msg.email}`}
                            className="text-indigo-600 hover:underline font-bold"
                          >
                            Reply Email
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
                  <span className="text-xs text-gray-400 font-medium">Add, edit, remove, and toggle visibility of catalogue fragrances</span>
                </div>
                
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center space-x-1.5 text-xs bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer font-bold shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Table search & refresh tools */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-[#E5E7EB] p-4 rounded-xl shadow-xs">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Product Name or Notes"
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none text-gray-800 transition-colors"
                  />
                </div>

                <button 
                  onClick={fetchProducts}
                  className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
                  <span>Sync Catalog</span>
                </button>
              </div>

              {/* Products Catalog Table */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-x-auto shadow-xs">
                {isLoadingProducts ? (
                  <div className="py-20 flex justify-center items-center space-x-3 text-xs text-gray-400">
                    <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Loading products inventory...</span>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-400">
                    No catalog products registered in database.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#E5E7EB] text-gray-400 font-semibold uppercase tracking-wider text-[9px]">
                        <th className="py-4.5 px-5">Image</th>
                        <th className="py-4.5 px-5">Fragrance Details</th>
                        <th className="py-4.5 px-5">Scent Notes</th>
                        <th className="py-4.5 px-5">Prices (Base/8g/15g)</th>
                        <th className="py-4.5 px-5">Intensity</th>
                        <th className="py-4.5 px-5">Status Tags</th>
                        <th className="py-4.5 px-5">Show on Website</th>
                        <th className="py-4.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          {/* Image Thumbnail */}
                          <td className="py-4 px-5">
                            <div className="w-12 h-12 rounded-lg border border-[#E5E7EB] overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                              <img 
                                src={product.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=100'} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          
                          {/* Name & family */}
                          <td className="py-4 px-5 leading-tight">
                            <span className="font-bold text-gray-900 block text-sm">{product.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">{product.family}</span>
                            <span className="text-[9px] text-gray-400 font-mono block mt-1">ID: {product.id}</span>
                          </td>

                          {/* Notes */}
                          <td className="py-4 px-5 max-w-[180px] truncate leading-relaxed font-light">
                            {product.scent || 'No notes specified'}
                          </td>

                          {/* Sizes Prices */}
                          <td className="py-4 px-5 leading-tight">
                            <span className="font-semibold text-gray-900 block">Base: ₹{product.price}</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">8g: {product.price8g ? `₹${product.price8g}` : 'N/A'}</span>
                            <span className="text-[10px] text-gray-500 block mt-0.5">15g: {product.price15g ? `₹${product.price15g}` : 'N/A'}</span>
                          </td>

                          {/* Intensity */}
                          <td className="py-4 px-5">
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < (product.intensity || 3) ? 'bg-indigo-600 shadow-[0_0_4px_rgba(79,70,229,0.4)]' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 pl-1 font-mono">{product.intensity || 3}/5</span>
                            </div>
                          </td>

                          {/* Badges */}
                          <td className="py-4 px-5 space-y-1">
                            {product.isBestSeller && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[#C9A84C] font-bold text-[8px] uppercase tracking-wider block w-fit">Best Seller</span>
                            )}
                            {product.isNew && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold text-[8px] uppercase tracking-wider block w-fit">New Release</span>
                            )}
                            {!product.isBestSeller && !product.isNew && (
                              <span className="text-gray-300 font-light">—</span>
                            )}
                          </td>

                          {/* Visibility toggle switch */}
                          <td className="py-4 px-5">
                            <button
                              onClick={() => handleToggleVisibility(product)}
                              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                                product.isVisible !== false
                                  ? 'border-emerald-200 text-emerald-600 bg-emerald-50/20 hover:bg-emerald-50/40'
                                  : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {product.isVisible !== false ? (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Visible</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* CRUD Actions */}
                          <td className="py-4 px-5 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="inline-flex p-2 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 border border-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(product)}
                              className="inline-flex p-2 text-red-500 hover:bg-red-50 hover:text-red-700 border border-red-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">System Settings</h1>
                <span className="text-xs text-gray-400 font-medium">Configure credentials, passwords, and notification triggers</span>
              </div>

              <div className="bg-white border border-[#E5E7EB] p-8 rounded-xl max-w-lg space-y-6 shadow-xs">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-gray-900">Administration Access</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    The panel credentials are configured in your server environment variables (`.env`). Modify `VITE_ADMIN_PASSWORD` to change your access password.
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-gray-100 pt-4">
                  <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold">Active Configuration</span>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100">
                      <span className="block text-[9px] text-gray-400 font-sans uppercase">Env Mode</span>
                      <span className="block font-bold mt-1 text-indigo-600">Production</span>
                    </div>
                    <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100">
                      <span className="block text-[9px] text-gray-400 font-sans uppercase">Database Type</span>
                      <span className="block font-bold mt-1 text-emerald-600">Supabase DB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS DETAIL PAGE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in text-left">
              {/* Header Title */}
              <div className="pb-3 border-b border-[#E5E7EB]">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sale Analytics</h1>
                <span className="text-xs text-gray-400 font-medium">Interactive graphing representing historical transactions, revenues, and sales</span>
              </div>

              {/* SVG Charts rows */}
              <div className="bg-white border border-[#E5E7EB] p-8 rounded-xl space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-gray-900">Historical Revenue Stream (2026)</h3>
                
                {/* SVG Curve */}
                <div className="h-80 w-full relative pt-4">
                  <svg viewBox="0 0 800 320" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grids */}
                    <line x1="50" y1="50" x2="750" y2="50" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="110" x2="750" y2="110" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="170" x2="750" y2="170" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="230" x2="750" y2="230" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="50" y1="280" x2="750" y2="280" stroke="#E5E7EB" strokeWidth="1" />

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Bezier Path */}
                    <path 
                      d="M 50,250 C 150,220 200,80 300,90 C 400,100 450,230 550,180 C 650,130 700,120 750,140" 
                      fill="none" 
                      stroke="#6366F1" 
                      strokeWidth="3.5" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M 50,250 C 150,220 200,80 300,90 C 400,100 450,230 550,180 C 650,130 700,120 750,140 L 750,280 L 50,280 Z" 
                      fill="url(#gradient-area)" 
                    />

                    {/* Active Point */}
                    <circle cx="300" cy="90" r="6" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2.5" />

                    {/* Active tooltip */}
                    <g transform="translate(265, 35)">
                      <rect width="70" height="24" rx="4" fill="#1E293B" />
                      <text x="35" y="15" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontWeight="bold">₹{stats.totalRevenue} (Peak)</text>
                    </g>
                    <line x1="300" y1="60" x2="300" y2="90" stroke="#6366F1" strokeWidth="1" strokeDasharray="2 2" />

                    {/* X axis labels */}
                    <text x="50" y="302" fill="#9CA3AF" fontSize="10" textAnchor="middle">Q1 (Jan-Mar)</text>
                    <text x="300" y="302" fill="#9CA3AF" fontSize="10" textAnchor="middle">Q2 (Apr-Jun)</text>
                    <text x="550" y="302" fill="#9CA3AF" fontSize="10" textAnchor="middle">Q3 (Jul-Sep)</text>
                    <text x="750" y="302" fill="#9CA3AF" fontSize="10" textAnchor="middle">Q4 (Oct-Dec)</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. ADD / EDIT PRODUCT MODAL DRAWER */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative text-left">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Catalog Management</span>
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h2>
            </div>

            <form onSubmit={handleProductFormSubmit} className="space-y-5">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                  placeholder="e.g. Amber Oud"
                  className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
              </div>

              {/* Grid 2-cols: Price and Scent Family */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Base price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Base Price (₹) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                    min="1"
                    placeholder="e.g. 499"
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                </div>

                {/* Scent Family */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Scent Family *</label>
                  <select
                    value={productForm.family}
                    onChange={(e) => setProductForm({...productForm, family: e.target.value})}
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none cursor-pointer transition-colors"
                  >
                    <option value="Floral">Floral</option>
                    <option value="Woody">Woody</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Oriental">Oriental</option>
                  </select>
                </div>
              </div>

              {/* Grid 2-cols: Sizes Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 8g Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">8g Tin Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price8g}
                    onChange={(e) => setProductForm({...productForm, price8g: e.target.value})}
                    placeholder="e.g. 299 (optional)"
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                </div>

                {/* 15g Price */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">15g Tin Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price15g}
                    onChange={(e) => setProductForm({...productForm, price15g: e.target.value})}
                    placeholder="e.g. 499 (optional)"
                    className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Scent Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Scent Notes description</label>
                <input
                  type="text"
                  value={productForm.scent}
                  onChange={(e) => setProductForm({...productForm, scent: e.target.value})}
                  placeholder="e.g. Dark Oud • Vetiver • Sweet Vanilla"
                  className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Short Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  rows="3"
                  placeholder="A deep mysterious scent blending amber with wood..."
                  className="w-full bg-[#F3F4F6] border border-transparent focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-gray-800 focus:outline-none resize-none font-sans transition-colors"
                />
              </div>

              {/* Images Manager */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold block">Product Gallery Images *</label>
                
                {/* 1. Previews of uploaded/selected images */}
                {(((productForm.images || []).length > 0) || (localFiles.length > 0)) && (
                  <div className="grid grid-cols-4 gap-3 border border-gray-200 p-3 rounded-lg bg-gray-50 max-h-32 overflow-y-auto">
                    {/* Existing Web URL Images */}
                    {(productForm.images || []).map((imgUrl, idx) => (
                      <div key={`exist-${idx}`} className="relative aspect-square rounded border border-[#E5E7EB] overflow-hidden bg-white group">
                        <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => {
                            const newImages = productForm.images.filter((_, i) => i !== idx)
                            setProductForm({
                              ...productForm,
                              images: newImages,
                              image: newImages[0] || ''
                            })
                          }}
                          className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer text-[10px] font-bold disabled:pointer-events-none"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    {/* Local Files selected, pending upload */}
                    {localFiles.map((file, idx) => {
                      const tempUrl = URL.createObjectURL(file)
                      return (
                        <div key={`local-${idx}`} className="relative aspect-square rounded border border-indigo-200 overflow-hidden bg-white group ring-2 ring-indigo-300">
                          <img src={tempUrl} alt="Pending Preview" className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[8px] px-1 rounded font-bold uppercase">New</div>
                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => {
                              setLocalFiles(localFiles.filter((_, i) => i !== idx))
                            }}
                            className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer text-[10px] font-bold disabled:pointer-events-none"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 2. Controls for choosing/uploading files and adding URLs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* File Selector */}
                  <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-indigo-500 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-white">
                    <Plus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[11px] font-bold text-gray-700">Choose Image files</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Select downloaded photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files) {
                          setLocalFiles([...localFiles, ...Array.from(e.target.files)])
                        }
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Manual paste URL fallback */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 space-y-1.5 flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Or Paste Image URL</span>
                    <div className="flex space-x-1.5">
                      <input
                        type="url"
                        id="paste-image-url-field"
                        placeholder="Paste web link..."
                        disabled={isUploading}
                        className="flex-1 bg-[#F3F4F6] border border-transparent rounded px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => {
                          const el = document.getElementById('paste-image-url-field')
                          if (el && el.value.trim()) {
                            const newUrl = el.value.trim()
                            const currentImages = productForm.images || []
                            setProductForm({
                              ...productForm,
                              images: [...currentImages, newUrl],
                              image: productForm.image || newUrl
                            })
                            el.value = ''
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white text-[10px] font-bold px-3 py-1.5 rounded cursor-pointer transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intensity level (1 to 5) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
                  <span>Scent Intensity</span>
                  <span className="font-mono text-indigo-600">{productForm.intensity}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  disabled={isUploading}
                  value={productForm.intensity}
                  onChange={(e) => setProductForm({...productForm, intensity: Number(e.target.value)})}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Checkboxes row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-2">
                <label className="inline-flex items-center space-x-2 text-xs text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    disabled={isUploading}
                    onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Best Seller</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productForm.isNew}
                    disabled={isUploading}
                    onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as New Release</span>
                </label>

                <label className="inline-flex items-center space-x-2 text-xs text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productForm.isVisible}
                    disabled={isUploading}
                    onChange={(e) => setProductForm({...productForm, isVisible: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Show on Website</span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 py-3 rounded-lg text-xs uppercase tracking-widest font-semibold cursor-pointer text-center transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg text-xs uppercase tracking-widest font-semibold cursor-pointer text-center transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CONFIRM DELETE DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xl max-w-sm w-full p-6 md:p-8 space-y-5 text-center text-left">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Delete Product Listing?</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{productToDelete.name}"</span>? This action cannot be undone and will remove it from database.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 border border-gray-200 text-gray-500 hover:bg-gray-50 py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProductConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-xs uppercase tracking-widest font-semibold cursor-pointer"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
