import api from "./api";

export const getStatsAPI = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const getRevenueAPI = async () => {
  const res = await api.get("/admin/analytics/revenue");
  return res.data;
};

export const getTopProductsAPI = async () => {
  const res = await api.get("/admin/analytics/top-products");
  return res.data;
};

export const getOrderStatsAPI = async () => {
  const res = await api.get("/admin/analytics/orders");
  return res.data;
};

export const getAdminOrdersAPI = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};