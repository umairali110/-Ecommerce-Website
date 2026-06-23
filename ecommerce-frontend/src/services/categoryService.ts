import axios from "axios";

const API = "http://localhost:3000/categories";

// GET ALL
export const getCategories = async () => {
  const res = await axios.get(API);
  return res.data;
};

// CREATE
export const createCategory = async (data: any) => {
  const res = await axios.post(API, data);
  return res.data;
};

// UPDATE
export const updateCategory = async (id: number, data: any) => {
  const res = await axios.patch(`${API}/${id}`, data);
  return res.data;
};

// DELETE
export const deleteCategory = async (id: number) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};