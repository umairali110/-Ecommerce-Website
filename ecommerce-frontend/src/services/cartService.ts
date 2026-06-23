import api from "./api";

// ➕ ADD TO CART (Backend)
export const addToCartAPI = async (productId: number, quantity = 1) => {
  const res = await api.post("/cart/add", {
    productId,
    quantity,
  });

  return res.data;
};

// 📥 GET CART
export const getCartAPI = async () => {
  const res = await api.get("/cart");
  return res.data;
};

// ❌ REMOVE ITEM
export const removeCartItemAPI = async (id: number) => {
  const res = await api.delete(`/cart/item/${id}`);
  return res.data;
};

// 🔄 UPDATE QTY
export const updateCartItemAPI = async (id: number, quantity: number) => {
  const res = await api.patch(`/cart/item/${id}`, {
    quantity,
  });

  return res.data;
};