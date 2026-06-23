import api from "./api";

// 🧾 Checkout API
export const checkoutAPI = async () => {
  const res = await api.post("/order/checkout");
  return res.data;
};
export const getMyOrdersAPI = async () => {
  const res = await api.get("/order/my-orders");
  return res.data;
};

export const getOrderByIdAPI = async (id: number) => {
  const res = await api.get(`/order/${id}`);
  return res.data;
};