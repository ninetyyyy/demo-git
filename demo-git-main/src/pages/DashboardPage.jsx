// src/pages/DashboardPage.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api"; // baseURL: http://localhost:5000, withCredentials: true

const DashboardPage = () => {
  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้จาก backend
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // *** ตรงกับฝั่ง backend ของทีม: GET /api/user ***
      const res = await api.get("/api/user", { validateStatus: () => true });

      if (res.status === 401) {
        // ยังไม่ล็อกอิน → กลับหน้า login
        // ใช้ navigate จะคงค่า basename (/demo-git) ให้อัตโนมัติ
        navigate("/login", { replace: true });
        return null;
      }
      if (res.status !== 200) {
        throw new Error(`Unexpected status ${res.status}`);
      }
      return res.data; // user object
    },
    refetchOnWindowFocus: false,
  });

  // ออกจากระบบ
  const handleLogout = async () => {
    try {
      // *** ตรงกับฝั่ง backend ของทีม: GET /logout ***
      await api.get("/logout", { withCredentials: true, validateStatus: () => true });

      // เลือกอย่างใดอย่างหนึ่ง:
      // 1) ใช้ navigate (เคารพ basename)
      navigate("/login", { replace: true });

      // 2) หรือ hard redirect (กันพลาด basename)
      // window.location.href = "/demo-git/login";
    } catch (e) {
      console.error("Logout error:", e);
      navigate("/login", { replace: true });
    }
  };

  if (isLoading) return <div className="p-10">Loading…</div>;
  if (isError)   return <div className="p-10 text-red-600">Error: {error?.message}</div>;
  if (!data)     return null; // กรณี 401 เรานำทางออกไปแล้ว

  const u = data;

  return (
    <div className="p-10">
      <h1 className="text-5xl font-extrabold mb-6">Welcome!</h1>

      <div className="rounded-xl shadow p-5 max-w-md bg-white">
        {u.photo && (
          <img
            src={u.photo}
            alt="avatar"
            className="w-16 h-16 rounded-full mb-4 object-cover"
            referrerPolicy="no-referrer"
          />
        )}
        <p><b>Name:</b> {u.displayName || u.name || "-"}</p>
        <p><b>Email:</b> {u.email || "-"}</p>
        <p className="text-xs text-gray-500">id: {u._id || u.id || "-"}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white py-2.5 px-5 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
