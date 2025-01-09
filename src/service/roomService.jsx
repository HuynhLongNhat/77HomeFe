import axios from "../utils/customAxios";

export const createNewRoom = (roomData) => {
  return axios.post("/room", roomData);
};

export const updateRoom = (id, roomData) => {
  return axios.put(`/room/${id}`, roomData);
};
