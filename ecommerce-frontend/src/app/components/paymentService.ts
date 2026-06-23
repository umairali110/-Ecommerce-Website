import api from "@/services/api";

// Stripe checkout start
export const createStripePaymentAPI = (orderId: number) => {
  return api.get(`/payment/stripe/${orderId}`);
};

// COD / manual payment
export const createPaymentAPI = (data: {
  orderId: number;
  method: string;
}) => {
  return api.post("/payment", data);
};