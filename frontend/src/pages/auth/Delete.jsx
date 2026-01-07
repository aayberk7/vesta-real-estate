import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function DeleteAccountModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm("⚠️ Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
      return;
    }

    try {
      await api.delete("/users/me");

      alert("🗑️ Hesabınız silindi!");
      logout();
      navigate("/");
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
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold"
          >
            İptal
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
}