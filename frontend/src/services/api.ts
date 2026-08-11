import axios from "axios";

const API = axios.create({
  baseURL: "https://attendance-management-system-ksun-9ujji8oee.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;