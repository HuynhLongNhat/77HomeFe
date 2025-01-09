import axios from "../utils/customAxios";

export const getAllUsers = () => {
  return axios.get("/user");
};

export const getUserById = (citizenNumber) => {
  return axios.get(`/user/${citizenNumber}`);
};

export const updateUser = (citizenNumber, data) => {
  return axios.put(`/user/${citizenNumber}`, data);
};

export const deleteUser = (citizenNumber) => {
  return axios.delete(`/user/${citizenNumber}`);
};
