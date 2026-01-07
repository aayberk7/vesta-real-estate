import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasyon
    if (!form.oldPassword || !form.newPassword || !form.confirmNewPassword) {
      alert("⚠️ Tüm alanları doldurun");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("⚠️ Yeni şifre en az 6 karakter olmalı");
      return;
    }

    if (!/[A-Z]/.test(form.newPassword)) {
      alert("⚠️ Yeni şifre en az 1 büyük harf içermeli");
      return;
    }

    if (!/[0-9]/.test(form.newPassword)) {
      alert("⚠️ Yeni şifre en az 1 rakam içermeli");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      alert("⚠️ Yeni şifreler uyuşmuyor");
      return;
    }

    try {
      await axios.put(
        "${import.meta.env.VITE_API_URL}/users/change-password",
        {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Şifre başarıyla değiştirildi!");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      onClose();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Şifre değiştirme başarısız"));
    }
  };

  const handleCancel = () => {
    setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-orange-500">🔒 Şifre Değiştir</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="oldPassword"
            placeholder="Mevcut Şifre"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Yeni Şifre (min 6, 1 büyük, 1 rakam)"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Yeni Şifre Tekrar"
            value={form.confirmNewPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition font-semibold"
            >
              Değiştir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}