// src/lib/api.js
import axios from "axios";

// ใช้พอร์ตของ backend ที่รันอยู่จริง (ของเพื่อนคือ 5000)
export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // ให้ส่งคุกกี้ติดไปด้วย
});
