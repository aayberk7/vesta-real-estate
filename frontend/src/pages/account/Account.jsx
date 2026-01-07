import { User, Mail, Calendar, Shield, Heart, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Account() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    favorites: 0,
    listings: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const favResponse = await api.get("/favorites");
      const listingsResponse = await api.get("/listings/my/listings");
      
      setStats({
        favorites: favResponse.data.length,
        listings: listingsResponse.data.length,
      });
    } catch (err) {
      console.error("İstatistikler yüklenemedi:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <section className="relative h-[90vh] flex items-center justify-center">
          <img
            src="https://sirdas.com.tr/storage/projects/9.jpg"
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
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 text-white text-3xl"
        >
          ☰
        </button>
      )}

      <h1 className="text-3xl font-bold mb-8 ml-7 -mt-2">Hesabım</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profil Kartı */}
        <div className="bg-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-6 mb-6">
            {user.profileImage ? (
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${user.profileImage}`}
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User size={48} />
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-white/60 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {user.email}
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-xl font-semibold ${
                user.role === "AGENT"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              <Shield size={16} className="inline mr-2" />
              {user.role === "AGENT" ? "Emlakçı" : "Müşteri"}
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <Calendar size={16} />
            Üyelik Tarihi: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid md:grid-cols-2 gap-6">
          <StatCard
            icon={<Heart />}
            title="Favorilerim"
            value={stats.favorites}
            color="pink"
            link="/favorites"
          />
          <StatCard
            icon={<Home />}
            title="İlanlarım"
            value={stats.listings}
            color="indigo"
            link="/my-listings"
          />
        </div>

        {/* Hesap İşlemleri */}
        <div className="bg-white/5 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Hesap İşlemleri</h3>

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/edit")}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              ✏️ Profil Bilgilerini Düzenle
            </button>

            <button
              onClick={() => (window.location.href = "/change-password")}
              className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              🔒 Şifre Değiştir
            </button>

            <button
              onClick={() => (window.location.href = "/delete")}
              className="w-full text-left px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition"
            >
              🗑️ Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, link }) {
  const colorClasses = {
    pink: "from-pink-500 to-rose-500",
    indigo: "from-indigo-500 to-purple-500",
  };

  return (
    <div
      onClick={() => (window.location.href = link)}
      className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-white/60 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}