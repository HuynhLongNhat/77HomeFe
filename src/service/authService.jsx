import axios from "../utils/customAxios";

export const registerUser = (authData) => {
  return axios.post("/register", authData);
};

export const loginUser = (authData) => {
  return axios.post("/login", authData);
};
