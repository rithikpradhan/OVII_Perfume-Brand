import { create } from 'zustand'
import { dbService } from './services/supabase'

const getInitialPage = () => {
  const path = window.location.pathname
  if (path === '/admin') return 'admin'
  if (path === '/catalog') return 'catalog'
  if (path === '/checkout') return 'checkout'
  if (path === '/contact') return 'contact'
  if (path.startsWith('/product')) return 'product'
  return 'home'
}

const getInitialProductId = () => {
  const path = window.location.pathname
  if (path.startsWith('/product')) {
    const parts = path.split('/')
    if (parts[2]) return parts[2]
  }
  return 'jasmine-touch'
}

export const useStore = create((set, get) => ({
  // Navigation State
  currentPage: getInitialPage(), // 'home' | 'catalog' | 'product' | 'checkout' | 'contact'
  selectedProductId: getInitialProductId(),
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setSelectedProductId: (id) => {
    set({ selectedProductId: id });
  },

  // Products State
  products: [],
  isLoadingProducts: false,
  productsError: null,

  fetchProducts: async () => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const data = await dbService.getProducts();
      set({ products: data, isLoadingProducts: false });
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ productsError: err.message, isLoadingProducts: false });
    }
  },

  addProduct: async (productData) => {
    try {
      await dbService.createProduct(productData);
      await get().fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      await dbService.updateProduct(id, productData);
      await get().fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      await dbService.deleteProduct(id);
      await get().fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  },

  uploadFile: async (file) => {
    try {
      return await dbService.uploadFile(file);
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  },

  // Orders State
  orders: [],
  isLoadingOrders: false,
  ordersError: null,

  fetchOrders: async () => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const data = await dbService.getOrders();
      set({ orders: data, isLoadingOrders: false });
    } catch (err) {
      console.error('Error fetching orders:', err);
      set({ ordersError: err.message, isLoadingOrders: false });
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      await get().fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  },

  updateOrderPaymentStatus: async (orderId, newPaymentStatus) => {
    try {
      await dbService.updateOrderPaymentStatus(orderId, newPaymentStatus);
      await get().fetchOrders();
    } catch (err) {
      console.error('Error updating order payment status:', err);
      throw err;
    }
  },

  // Messages State
  messages: [],
  isLoadingMessages: false,
  messagesError: null,

  fetchMessages: async () => {
    set({ isLoadingMessages: true, messagesError: null });
    try {
      const data = await dbService.getContactMessages();
      set({ messages: data, isLoadingMessages: false });
    } catch (err) {
      console.error('Error fetching messages:', err);
      set({ messagesError: err.message, isLoadingMessages: false });
    }
  },

  // Cart State
  cart: [],
  isCartOpen: false,
  setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  addToCart: (product, size, quantity, price) => set((state) => {
    const cartId = `${product.id}-${size}`;
    const existingItem = state.cart.find((item) => item.cartId === cartId);
    let updatedCart;
    if (existingItem) {
      updatedCart = state.cart.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [
        ...state.cart,
        {
          cartId,
          id: product.id,
          name: product.name,
          price: price,
          size: size,
          scent: product.scent,
          image: product.image,
          quantity: quantity
        }
      ];
    }
    return { cart: updatedCart, isCartOpen: true };
  }),

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter((item) => item.cartId !== cartId)
  })),

  updateQuantity: (cartId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cart: state.cart.filter((item) => item.cartId !== cartId) };
    }
    return {
      cart: state.cart.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    };
  }),

  clearCart: () => set({ cart: [] })
}))
