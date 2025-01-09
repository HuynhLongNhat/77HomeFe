import axios from "../utils/customAxios";

export const createNewAppoitment = (roomData) => {
  return axios.post("/appointment", roomData);
};

export const updateRoom = (id, roomData) => {
  return axios.put(`/room/${id}`, roomData);
};

export const getAppointmentByAdmin = ()  =>{
  return axios.get("/appointment/admin/all");
}

export const acceptAppointmentByAdmin = (appointmentId)  =>{
  return axios.put(`/appointment/admin/${appointmentId}/accept`);
}

export const rejectAppointmentByAdmin = (appointmentId, rejectedReason) => {
  return axios.put(
    `/appointment/admin/${appointmentId}/reject`,
    rejectedReason
  );
};

export const getAppointmentByOwner = (citizenNumber) => {
  return axios.get(`/appointment/owner/${citizenNumber}`);
};


export const acceptAppointmentByOwner = (appointmentId) => {
  return axios.put(`/appointment/owner/${appointmentId}/accept`);
};

export const rejectAppointmentByOwner = (appointmentId, rejectedReason) => {
  return axios.put(
    `/appointment/owner/${appointmentId}/reject`,
    rejectedReason
  );
};


export const getAppointmentByRenter = (citizenNumber) => {
  return axios.get(`/appointment/renter/${citizenNumber}`);
};

export const abortAppointmentByRenter = (appointmentId, abortedReason) => {
  return axios.put(`/appointment/renter/${appointmentId}/abort`, abortedReason);
};

