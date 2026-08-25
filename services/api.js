import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflowbackend-rust.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
