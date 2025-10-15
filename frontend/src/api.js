import axios from "axios";

const API_BASE = "http://127.0.0.1:5000"; // must match Flask backend

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" }, // default JSON header
});


// --- Fake Delivery Toggle ---
export const USE_FAKE_DELIVERY = true;

export const getDeliveryStatus = async (trackingId) => {
  if (USE_FAKE_DELIVERY) {
    return {
      id: trackingId,
      status: "In Transit",
      location: "Mumbai",
      estimatedDelivery: "2025-10-07",
    };
  }
  const res = await api.get(`/delivery/${trackingId}`);
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export default api;
