// productService.ts
import api from "./api";

export const getProducts = () => api.get("/products").then(r => r.data);

export const getProductById = (id: number | string) =>
  api.get(`/products/${id}`).then(r => r.data);