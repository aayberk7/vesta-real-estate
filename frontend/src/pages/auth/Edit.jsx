import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Edit({ isOpen, onClose, onSuccess }) {
  const { user, token, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("username", form.username);
      data.append("email", form.email);
      if (photo) data.append("photo", photo);

      const response = await axios.put(
        "${import.meta.env.VITE_API_URL}/users/me",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(response.data);
      alert("✅ Profil güncellendi!");
      setPreview(null);
      setPhoto(null);
      onSuccess();
      onClose();
    } catch (err) {
      alert("❌ Güncelleme başarısız");
    }
  };

  const handleCancel = () => {
    setForm({
      username: user?.username || "",
      email: user?.email || "",
    });
    setPreview(null);
    setPhoto(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-indigo-500">
          ✏️ Profili Düzenle
        </h3>

        


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FOTOĞRAF ÖNİZLEME */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-black/40 border-2 border-white/20 mb-3">
              {preview || user?.profileImage ? (
                <img
                  src={preview || `${import.meta.env.VITE_API_URL}${user.profileImage}`}
                  alt={user?.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                  {user?.username[0].toUpperCase()}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              📷 Fotoğraf Değiştir
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* KULLANICI ADI */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* E-POSTA */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BUTONLAR */}
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
              className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}