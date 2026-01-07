import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function ChangePassword() {
  const { user, logout } = useAuth();
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
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert("✅ Şifre başarıyla değiştirildi!");
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      onClose();
    } catch (err) {
      alert(
        "❌ Şifre değiştirilemedi: " +
          (err.response?.data?.message || "Mevcut şifre hatalı")
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapmanız Gerekiyor</h1>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Şifre Değiştir</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mevcut Şifre"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                ⚠️ {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => (window.location.href = "/account")}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Değiştir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}