import axios from "../utils/customAxios";

// paymentService.jsx
export const createPaymentLink = async (data) => {
  try {
    const response = await axios.post("/payment/create-payment-link", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating payment link');
  }
};

export const processPaymentCallback = async (orderCode) => {
  try {
    const response = await axios.post("/payment/callback", { orderCode });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error processing payment');
  }
};
