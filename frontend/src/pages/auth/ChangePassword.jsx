import { useState } from "react";
import api from "../../api/axios";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.currentPassword) {
      newErrors.currentPassword = "Mevcut şifre gerekli";
    }

    if (!form.newPassword) {
      newErrors.newPassword = "Yeni şifre gerekli";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Şifre en az 6 karakter olmalı";
    } else if (!/[A-Z]/.test(form.newPassword)) {
      newErrors.newPassword = "Şifre en az 1 büyük harf içermeli";
    } else if (!/[0-9]/.test(form.newPassword)) {
      newErrors.newPassword = "Şifre en az 1 rakam içermeli";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Şifre tekrarı gerekli";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Şifreler uyuşmuyor";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.put("/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("✅ Şifre başarıyla değiştirildi!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
      onClose();
    } catch (err) {
      alert(
        "❌ Şifre değiştirilemedi: " +
          (err.response?.data?.message || "Mevcut şifre hatalı")
      );
    }
  };

  const handleCancel = () => {
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-orange-500">🔒 Şifre Değiştir</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mevcut Şifre"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-orange-500"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-400 text-sm mt-1">
                ⚠️ {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Yeni Şifre (min 6 karakter, 1 büyük harf, 1 rakam)"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-orange-500"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-400 text-sm mt-1">
                ⚠️ {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Yeni Şifre Tekrar"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-orange-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                ⚠️ {errors.confirmPassword}
              </p>
            )}
          </div>

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