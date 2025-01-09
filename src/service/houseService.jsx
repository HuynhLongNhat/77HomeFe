import axios from "../utils/customAxios";

export const createHouse = (data) => {
  return axios.post("/house", { ...data });
};

export const getAllHouse = () => {
  return axios.post("/house");
};

export const getHouseDetail = (id) => {
  return axios.get(`/house/${id}`);
};

export const updateHouse = (id, data) => {
  return axios.put(`/house/${id}`, data);
};

export const deleteHouse = (id) => {
  return axios.delete(`/house/${id}`);
};
