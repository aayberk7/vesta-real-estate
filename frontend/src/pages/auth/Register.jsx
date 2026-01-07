import { useState } from "react";
import api from "../../api/axios";

export default function Register({onSuccess}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Input değiştiğinde ilgili hatayı temizle
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Boş alan kontrolü
    if (!form.username.trim()) {
      newErrors.username = "Kullanıcı adı boş olamaz";
    }

    if (!form.email.trim()) {
      newErrors.email = "E-posta boş olamaz";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Geçerli bir e-posta girin";
    }

    if (!form.password) {
      newErrors.password = "Şifre boş olamaz";
    } else if (form.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Şifre en az 1 büyük harf içermeli";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Şifre en az 1 küçük harf içermeli";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Şifre en az 1 rakam içermeli";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Şifre doğrulaması boş olamaz";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Şifreler uyuşmuyor";
    }

    if (!form.role) {
      newErrors.role = "Lütfen bir rol seçin";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validasyon kontrolü
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const data = new FormData();
  data.append("username", form.username);
  data.append("email", form.email);
  data.append("password", form.password);
  data.append("role", form.role);
  if (photo) data.append("photo", photo);

  try {
    // api kullan (axios.jsx'ten import edildi)
    await api.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Kayıt başarılı 🎉");
    onSuccess();
  } catch (err) {
    console.error("REGISTER ERROR:", err.response?.data || err);
    alert("Kayıt başarısız: " + (err.response?.data?.message || "Bir hata oluştu"));
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Kayıt Ol
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              value={form.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.username ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Şifre (min 6 karakter, 1 büyük harf, 1 rakam)"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Şifre Doğrula"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                errors.role ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            >
              <option value="">Rol Seç</option>
              <option value="CUSTOMER">Müşteri</option>
              <option value="AGENT">Emlakçı</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">⚠️ {errors.role}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profil Fotoğrafı (İsteğe Bağlı)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Kayıt Ol
          </button>

        </form>
      </div>
    </div>
  );
}