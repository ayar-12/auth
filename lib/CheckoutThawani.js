// src/lib/checkoutThawani.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function startThawaniCheckout({ cartItems, customer, baseUrl }) {
  try {
    // Convert cart to Thawani products: unit_amount in Baisa
    const products = cartItems.map((it) => ({
      name: `${it.name} — ${it.size}`,
      unit_amount: Math.round(Number(it.price) * 1000), // OMR -> Baisa
      quantity: Number(it.quantity || 1),
    }));

    const successUrl = `${baseUrl}/checkout/success`;
    const cancelUrl = `${baseUrl}/checkout/cancel`;

    const { data } = await axios.post(`${API}/api/v1/pay/thawani/session`, {
      client_reference_id: `order_${Date.now()}`,
      products,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customerData: {
          email: customer?.email,
          phone: customer?.phone,
        },
      },
    });

    if (!data?.pay_url) throw new Error("No pay_url returned from server");
    
    // Redirect the browser
    window.location.href = data.pay_url;
  } catch (error) {
    console.error("Thawani checkout error:", error);
    throw new Error(error.response?.data?.message || error.message || "Payment initialization failed");
  }
}