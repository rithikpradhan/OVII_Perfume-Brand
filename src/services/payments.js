/**
 * Mock Razorpay & WhatsApp Business API Payment Service
 * 
 * Production Setup Steps:
 * 1. Razorpay Integration:
 *    - Add Razorpay Checkout script to index.html: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *    - Implement server-side order creation API
 *    - Instantiate new window.Razorpay(options).open() in frontend
 * 
 * 2. WhatsApp Notification:
 *    - Set up a Twilio or Meta WhatsApp Business API client in your backend
 *    - Send order alerts when checkout.js returns a successful payment signature
 */

export const mockPayments = {
  // Simulate opening Razorpay Checkout
  checkout: async (orderDetails, onPaymentSuccess, onPaymentError) => {
    console.log('[Razorpay] Opening checkout for order:', orderDetails);
    
    // Simulate loading overlay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return new Promise((resolve) => {
      // In our React UI, we will render a beautiful modal overlay when checkout is called.
      // This helper will return details that the UI uses to show the checkout modal.
      resolve({
        order_id: `order_${Math.random().toString(36).substr(2, 9)}`,
        amount: orderDetails.amount,
        currency: orderDetails.currency || 'INR'
      });
    });
  },

  // Simulate sending owner notification via WhatsApp Business API
  sendWhatsAppNotification: async (orderId, amount, items) => {
    const itemSummary = items.map(item => `${item.name} x${item.quantity}`).join(', ');
    const message = `🔔 *New Ovii Order Received!*\n\nOrder ID: ${orderId}\nTotal: ₹${amount}\nItems: ${itemSummary}\n\nStatus: Paid via Razorpay`;
    
    console.log('%c[WhatsApp API Alert Sent to Owner]', 'background: #25D366; color: white; font-weight: bold; padding: 4px; border-radius: 4px;', message);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    return {
      success: true,
      messageSent: message,
      timestamp: new Date().toISOString()
    };
  }
};
