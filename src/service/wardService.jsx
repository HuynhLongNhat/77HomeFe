import axios from "../utils/customAxios";

export const getAllWard = () => {
  return axios.get("/ward");
};
