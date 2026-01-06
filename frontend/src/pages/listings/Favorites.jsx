import { Heart, Home, MapPin, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Favoriler yüklenemedi:", err);
      setLoading(false);
    }
  };

  const removeFavorite = async (listingId) => {
    try {
      await api.delete(`/favorites/${listingId}`);
      setFavorites(favorites.filter((f) => f.listing.id !== listingId));
      alert("Favorilerden çıkarıldı!");
    } catch (err) {
      console.error("Favori çıkarılamadı:", err);
      alert("Bir hata oluştu");
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
            <h1 className="text-3xl font-bold mb-8 ml-9 -mt-0">Favorilerim</h1>
          </div>

          <p className="text-xl animate-pulse text-white">
            Henüz Giriş Yapmadınız.
          </p>

          <div className="absolute top-0 right-0 z-10 p-6 text-white">
            <h2 className="text-5xl font-serif italic text-white">vesta</h2>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl">Yükleniyor...</p>
        </div>
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
      <h1 className="text-3xl font-bold mb-8 ml-7 -mt-2">
        Favorilerim ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FavoritesGrid favorites={favorites} onRemove={removeFavorite} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <Heart size={40} className="text-pink-400" />
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        Henüz favori eklemediniz
      </h2>

      <p className="text-white/60 max-w-md mb-6">
        Beğendiğiniz evleri favorilere ekleyerek daha sonra kolayca
        ulaşabilirsiniz.
      </p>

      <button
        onClick={() => (window.location.href = "/listings")}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition font-semibold flex items-center gap-2"
      >
        <Home size={18} />
        İlanlara Göz At
      </button>
    </div>
  );
}

function FavoritesGrid({ favorites, onRemove }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 rounded-2xl overflow-hidden hover:scale-[1.02] transition"
        >
          {item.listing.image ? (
            <img
              src={`http://localhost:3000${item.listing.image}`}
              alt={item.listing.title}
              className="h-52 w-full object-cover"
            />
          ) : (
            <div className="h-52 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Home size={64} className="text-white/40" />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg flex-1">
                {item.listing.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.listing.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-400"
                    : item.listing.status === "SOLD"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {item.listing.status === "ACTIVE"
                  ? "Aktif"
                  : item.listing.status === "SOLD"
                  ? "Satıldı"
                  : "Kiralandı"}
              </span>
            </div>

            <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
              <MapPin size={14} /> {item.listing.district?.name}
            </p>

            <p className="text-white/60 text-sm mt-1">
              📦 {item.listing.category?.name}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-indigo-400 font-bold text-xl">
                {new Intl.NumberFormat("tr-TR").format(item.listing.price)} ₺
              </span>

              <button
                onClick={() => onRemove(item.listing.id)}
                className="text-pink-400 hover:text-pink-500 hover:scale-110 transition"
              >
                <Heart fill="currentColor" size={24} />
              </button>
            </div>

            <p className="text-white/50 text-xs mt-3">
              👤 {item.listing.owner?.username}
            </p>

            <p className="text-white/40 text-xs mt-2">
              ❤️ {new Date(item.createdAt).toLocaleDateString("tr-TR")} tarihinde
              eklendi
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 