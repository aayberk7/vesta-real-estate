import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { token, logout } = useAuth(); // logout buraya eklendi
  const navigate = useNavigate(); // navigate eklendi

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🗑️ Hesabınız silindi!");
      logout(); // Önce çıkış yap
      navigate("/"); // Sonra yönlendir
    } catch (err) {
      alert("❌ Hesap silme başarısız: " + (err.response?.data?.message || "Hata oluştu"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-red-500">⚠️ Dikkat!</h3>
        <p className="text-white/80 mb-6">
          Hesabınızı silmek üzeresiniz. Bu işlem <span className="font-bold text-red-400">geri alınamaz</span> ve tüm verileriniz silinecektir.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose} // Sadece kapatma fonksiyonunu çağır
            className="flex-1 px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold"
          >
            İptal
          </button>
          <button
            onClick={handleDelete} // Doğru fonksiyon ismi
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}