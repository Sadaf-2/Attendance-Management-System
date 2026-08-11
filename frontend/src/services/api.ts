import axios from "axios";

const API = axios.create({
  baseURL: "https://attendance-management-system-kemoprvvl-isadaf240-3551s-projects.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;