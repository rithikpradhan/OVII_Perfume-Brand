import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize real Supabase if keys are provided, otherwise null
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!supabase) {
  console.warn(
    '%c[Ovii Database Status] Supabase credentials not found in env. Running in LocalStorage fallback mode.',
    'color: #C9A84C; font-weight: bold;'
  )
}

const DEFAULT_PRODUCTS = [
  {
    id: 'jasmine-touch',
    name: 'Jasmine Touch',
    price: 499,
    price8g: 299,
    price15g: 499,
    scent: 'Star Jasmine • Warm Amber • Citrus',
    family: 'Floral',
    description: 'A delicate white floral bouquet grounded in soft warm amber. Sophisticated, light, and deeply comforting.',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true,
    isNew: false,
    dateAdded: '2026-01-01',
    intensity: 3,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'sandalwood-reverie',
    name: 'Sandalwood Reverie',
    price: 549,
    price8g: 349,
    price15g: 549,
    scent: 'Mysore Sandalwood • Cedarwood • Warm Gold Amber',
    family: 'Woody',
    description: 'Rich woody core balanced by warm amber tones. An earthier, grounding unisex fragrance representing quiet luxury.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: false,
    dateAdded: '2026-02-15',
    intensity: 4,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'fresh-citrus-bloom',
    name: 'Fresh Citrus Bloom',
    price: 449,
    price8g: 279,
    price15g: 449,
    scent: 'Bergamot • Lemon Zest • Neroli Bloom',
    family: 'Fresh',
    description: 'Sparkling citrus notes layered over soft orange blossoms. Revitalizing, clean, and sun-drenched.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: true,
    dateAdded: '2026-05-15',
    intensity: 2,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'oud-noir',
    name: 'Oud Noir',
    price: 699,
    price8g: 449,
    price15g: 699,
    scent: 'Dark Oud • Smoky Vetiver • Warm Vanilla',
    family: 'Oriental',
    description: 'A deep, mysterious blend of rich agarwood and smoky vetiver, rounded with sweet vanilla beans.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    isBestSeller: true,
    isNew: true,
    dateAdded: '2026-05-20',
    intensity: 5,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'rose-petal-mist',
    name: 'Rose Petal Mist',
    price: 499,
    price8g: 299,
    price15g: 499,
    scent: 'Damask Rose • Morning Dew • Soft White Musk',
    family: 'Floral',
    description: 'A crisp, modern interpretation of classic rose, softened by light morning dew and clean white musk.',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    isBestSeller: false,
    isNew: true,
    dateAdded: '2026-05-01',
    intensity: 3,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800']
  }
]

export const dbService = {
  // 1. ORDERS ACTIONS
  createOrder: async (orderData) => {
    const formattedOrder = {
      customer_name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: `${orderData.address}, ${orderData.city}, ${orderData.state} - ${orderData.pincode}`,
      items: typeof orderData.items === 'string' ? orderData.items : JSON.stringify(orderData.items),
      total: Number(orderData.total),
      status: 'Pending',
      payment_method: orderData.payment_method || 'COD',
      payment_status: orderData.payment_status || 'Pending',
      created_at: new Date().toISOString()
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([formattedOrder])
        .select()

      if (error) throw error
      return data[0]
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 800))
      const orders = JSON.parse(localStorage.getItem('ovii_orders') || '[]')
      const fallbackOrder = {
        id: `OVII-LOCAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ...formattedOrder,
        items: typeof orderData.items === 'string' ? JSON.parse(orderData.items) : orderData.items
      }
      orders.unshift(fallbackOrder)
      localStorage.setItem('ovii_orders', JSON.stringify(orders))
      return fallbackOrder
    }
  },

  getOrders: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(order => ({
        ...order,
        items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items
      }))
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 600))
      const orders = JSON.parse(localStorage.getItem('ovii_orders') || '[]')
      return orders
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()

      if (error) throw error
      return data[0]
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 500))
      const orders = JSON.parse(localStorage.getItem('ovii_orders') || '[]')
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('ovii_orders', JSON.stringify(updatedOrders))
      return { id: orderId, status: newStatus }
    }
  },

  updateOrderPaymentStatus: async (orderId, newPaymentStatus) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('id', orderId)
        .select()

      if (error) throw error
      return data[0]
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 500))
      const orders = JSON.parse(localStorage.getItem('ovii_orders') || '[]')
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order
      )
      localStorage.setItem('ovii_orders', JSON.stringify(updatedOrders))
      return { id: orderId, payment_status: newPaymentStatus }
    }
  },

  // 2. NEWSLETTER SUBSCRIPTIONS
  subscribeNewsletter: async (email) => {
    const formattedSub = {
      email,
      created_at: new Date().toISOString()
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([formattedSub])
        .select()

      if (error) throw error
      return data[0]
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 500))
      const subs = JSON.parse(localStorage.getItem('ovii_subscribers') || '[]')
      subs.push(formattedSub)
      localStorage.setItem('ovii_subscribers', JSON.stringify(subs))
      return formattedSub
    }
  },

  // 3. CONTACT FORM MESSAGES
  submitContactForm: async (formData) => {
    const formattedMsg = {
      customer_name: formData.name,
      email: formData.email,
      message: formData.message,
      created_at: new Date().toISOString()
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([formattedMsg])
        .select()

      if (error) throw error
      return data[0]
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 700))
      const msgs = JSON.parse(localStorage.getItem('ovii_messages') || '[]')
      const newMsg = {
        id: Math.random().toString(36).substr(2, 9),
        ...formattedMsg
      }
      msgs.unshift(newMsg) // Unshift to put latest at top
      localStorage.setItem('ovii_messages', JSON.stringify(msgs))
      return newMsg
    }
  },

  getContactMessages: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } else {
      await new Promise(resolve => setTimeout(resolve, 500))
      return JSON.parse(localStorage.getItem('ovii_messages') || '[]')
    }
  },

  uploadFile: async (file) => {
    if (supabase) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 11)}-${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return publicUrl
    } else {
      // LocalStorage Fallback: Convert to Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (e) => reject(e)
        reader.readAsDataURL(file)
      })
    }
  },

  // 4. PRODUCTS ACTIONS
  getProducts: async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [p.image]
      }))
    } else {
      // LocalStorage Fallback
      await new Promise(resolve => setTimeout(resolve, 500))
      let localProds = localStorage.getItem('ovii_products')
      if (!localProds) {
        localStorage.setItem('ovii_products', JSON.stringify(DEFAULT_PRODUCTS))
        return DEFAULT_PRODUCTS
      }
      return JSON.parse(localProds)
    }
  },

  createProduct: async (productData) => {
    const newProduct = {
      id: productData.id || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: productData.name,
      price: Number(productData.price),
      price8g: productData.price8g ? Number(productData.price8g) : null,
      price15g: productData.price15g ? Number(productData.price15g) : null,
      scent: productData.scent,
      family: productData.family,
      description: productData.description,
      image: productData.image,
      images: productData.images || [productData.image],
      isBestSeller: !!productData.isBestSeller,
      isNew: !!productData.isNew,
      intensity: Number(productData.intensity || 3),
      isVisible: productData.isVisible !== false,
      created_at: new Date().toISOString()
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()

      if (error) throw error
      return data[0]
    } else {
      await new Promise(resolve => setTimeout(resolve, 500))
      const products = JSON.parse(localStorage.getItem('ovii_products') || '[]')
      products.unshift(newProduct)
      localStorage.setItem('ovii_products', JSON.stringify(products))
      return newProduct
    }
  },

  updateProduct: async (id, productData) => {
    const updatedFields = {
      name: productData.name,
      price: Number(productData.price),
      price8g: productData.price8g ? Number(productData.price8g) : null,
      price15g: productData.price15g ? Number(productData.price15g) : null,
      scent: productData.scent,
      family: productData.family,
      description: productData.description,
      image: productData.image,
      images: productData.images || [productData.image],
      isBestSeller: !!productData.isBestSeller,
      isNew: !!productData.isNew,
      intensity: Number(productData.intensity || 3),
      isVisible: productData.isVisible !== false
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(updatedFields)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } else {
      await new Promise(resolve => setTimeout(resolve, 500))
      const products = JSON.parse(localStorage.getItem('ovii_products') || '[]')
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, ...updatedFields } : p
      )
      localStorage.setItem('ovii_products', JSON.stringify(updatedProducts))
      return { id, ...updatedFields }
    }
  },

  deleteProduct: async (id) => {
    if (supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    } else {
      await new Promise(resolve => setTimeout(resolve, 500))
      const products = JSON.parse(localStorage.getItem('ovii_products') || '[]')
      const filteredProducts = products.filter(p => p.id !== id)
      localStorage.setItem('ovii_products', JSON.stringify(filteredProducts))
      return id
    }
  }
}

// Keep old mockSupabase name export for backwards compatibility
export const mockSupabase = dbService
