import axios from "../utils/customAxios";

export const createBuilding = (data) => {
  return axios.post("/building", { ...data });
};

export const getAllBuilding = () => {
  return axios.get("/building");
};


export const getBuildingDetail = (id) => {
  return axios.get(`/building/${id}`);
};

export const updateBuilding = (id, data) => {
  return axios.put(`/building/${id}`, data);
};

export const deleteBuilding = (id) => {
  return axios.delete(`/building/${id}`);
};
