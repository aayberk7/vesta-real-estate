import { Mail, ShieldCheck, Home, Heart, Briefcase, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import EditProfileModal from "../auth/Edit";
import ChangePasswordModal from "../auth/ChangePassword";

import DeleteAccountModal from "../auth/Delete";


export default function MyAccount() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  

  useEffect(() => {
    if (user) {
      fetchMyListings();
      fetchFavorites();
    }
  }, [user]);
  
  const fetchFavorites = async () => {
  try {
    const response = await axios.get(
      "${import.meta.env.VITE_API_URL}/favorites",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setFavorites(response.data);
  } catch (err) {
    console.error("Favoriler yüklenemedi:", err);
  }
};

  const fetchMyListings = async () => {
    try {
      const response = await axios.get("${import.meta.env.VITE_API_URL}/listings/my/listings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("İlanlar yüklenemedi:", err);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 ">
        <section className="relative h-[90vh] flex items-center justify-center">
          <img
            src="https://sirdas.com.tr/storage/projects/6.jpg"
            alt="Home"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed top-6 left-6 z-50 text-white text-3xl"
            >
              ☰
            </button>
          )}

          <div className="absolute top-0 left-0 z-10 p-6 text-white">
            <h1 className="text-3xl font-bold mb-8 ml-9 -mt-0">Hesabım</h1>
          </div>

          <p className="text-xl animate-pulse text-white">Henüz Giriş Yapmadınız.</p>

          <div className="absolute top-0 right-0 z-10 p-6 text-white">
            <h2 className="text-5xl font-serif italic text-white">vesta</h2>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-8">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-white text-3xl"
        >
          ☰
        </button>
      )}

      {/* HERO PROFIL */}
      <div
        className="relative rounded-3xl p-8 shadow-2xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-0 right-0 opacity-10 text-[180px] font-bold z-0">
          VESTA
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center text-4xl font-bold overflow-hidden border-2 border-white/20">
            {user.profileImage ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-white/80 flex items-center gap-2 mt-1">
              <Mail size={16} /> {user.email}
            </p>
            <span className="inline-flex items-center gap-2 mt-3 px-4 py-1 rounded-full bg-black/40 text-sm">
              <ShieldCheck size={16} />
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* ISTATISTIKLER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <StatCard icon={<Home />} title="İlanlarım" value={myListings.length} />
        <StatCard icon={<Heart />} title="Favorilerim" value={favorites.length} />
        {(user.role === "agent" || user.role === "AGENT") && (
          <StatCard icon={<Briefcase />} title="Komisyonlarım" value={0} />
        )}
      </div>

      {/* KISISSEL BILGILER */}
      <div className="mt-12 bg-white/5 rounded-2xl p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <InfoRow label="Ad Soyad" value={user.username} />
          <InfoRow label="E-posta" value={user.email} />
          <InfoRow label="Rol" value={user.role} />
          <InfoRow label="Hesap Durumu" value="Aktif" />
        </div>
      </div>

      {/* AYARLAR */}
      <div className="mt-10 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold flex items-center gap-2"
          >
            <Trash2 size={18} />
            Hesabımı Sil
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition font-semibold flex items-center gap-2"
          >
            🔒 Şifre Değiştir
          </button>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition font-semibold"
        >
          Profili Düzenle
        </button>
      </div>

      {/* MODALS */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={fetchMyListings}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() =>setShowDeleteConfirm(false)}
      />
    </div>
  );
}

/* --- KÜÇÜK BİLEŞENLER --- */

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition">
      <div className="p-4 rounded-xl bg-indigo-500/20">{icon}</div>
      <div>
        <p className="text-sm text-white/70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}