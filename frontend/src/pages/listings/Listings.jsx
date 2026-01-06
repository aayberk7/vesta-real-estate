import { MapPin, Home, Search, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/listings`);
      setListings(response.data);
      setFilteredListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("İlanlar yüklenemedi:", err);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredListings(listings);
      return;
    }

    const filtered = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(term.toLowerCase()) ||
        listing.district?.name.toLowerCase().includes(term.toLowerCase()) ||
        listing.category?.name.toLowerCase().includes(term.toLowerCase()) ||
        listing.price.toString().includes(term)
    );
    setFilteredListings(filtered);
  };

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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold ml-7 -mt-2">Ev İlanları</h1>
          <p className="text-white/60 mt-1 ml-7">
            Size en uygun evi VESTA ile bulun ({filteredListings.length} ilan)
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={18}
          />
          <input
            placeholder="İlçe, kategori veya fiyat ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <ListingsGrid
          listings={filteredListings}
          onDetailClick={setSelectedListing}
        />
      )}

      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          user={user}
        />
      )}
    </div>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <Home size={48} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">
        {searchTerm ? "Sonuç bulunamadı" : "Henüz ilan eklenmedi"}
      </h2>

      <p className="text-white/60 max-w-md mb-6">
        {searchTerm
          ? "Arama kriterlerinize uygun ilan bulunamadı. Farklı kelimeler deneyin."
          : "Çok yakında yüzlerce ev ilanı burada listelenecek."}
      </p>
    </div>
  );
}

function ListingsGrid({ listings, onDetailClick }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((item) => (
        <div
          key={item.id}
          onClick={() => onDetailClick(item)}
          className="bg-white/5 rounded-2xl overflow-hidden hover:scale-[1.02] transition cursor-pointer"
        >
          {item.image ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${item.image}`}
              alt={item.title}
              className="h-52 w-full object-cover"
            />
          ) : (
            <div className="h-52 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Home size={64} className="text-white/40" />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg flex-1">{item.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "ACTIVE"
                    ? "bg-green-500/20 text-green-400"
                    : item.status === "SOLD"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {item.status === "ACTIVE"
                  ? "Aktif"
                  : item.status === "SOLD"
                  ? "Satıldı"
                  : "Kiralandı"}
              </span>
            </div>

            <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
              <MapPin size={14} /> {item.district?.name}
            </p>

            <p className="text-white/60 text-sm mt-1">
              📦 {item.category?.name}
            </p>

            <div className="flex justify-between items-center mt-4">
              <span className="text-indigo-400 font-bold text-xl">
                {new Intl.NumberFormat("tr-TR").format(item.price)} ₺
              </span>
            </div>

            <p className="text-white/50 text-xs mt-3">
              👤 {item.owner?.username}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingDetailModal({ listing, onClose, user }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavorite();
    }
  }, [listing.id, user]);

  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/check/${listing.id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (err) {
      console.error("Favori kontrolü başarısız:", err);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Favorilere eklemek için giriş yapmalısınız!");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${listing.id}`);
        setIsFavorite(false);
        alert("Favorilerden çıkarıldı!");
      } else {
        await api.post(`/favorites/${listing.id}`);
        setIsFavorite(true);
        alert("Favorilere eklendi!");
      }
    } catch (err) {
      console.error("Favori işlemi başarısız:", err);
      alert(err.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl my-8 overflow-hidden">
        <div className="relative h-96">
          {listing.image ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${listing.image}`}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Home size={120} className="text-white/40" />
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition flex items-center justify-center"
          >
            ✕
          </button>

          <div className="absolute top-4 left-4">
            <span
              className={`px-4 py-2 rounded-full font-semibold ${
                listing.status === "ACTIVE"
                  ? "bg-green-500/90 text-white"
                  : listing.status === "SOLD"
                  ? "bg-red-500/90 text-white"
                  : "bg-yellow-500/90 text-white"
              }`}
            >
              {listing.status === "ACTIVE"
                ? "🟢 Aktif"
                : listing.status === "SOLD"
                ? "🔴 Satıldı"
                : "🟡 Kiralandı"}
            </span>
          </div>
        </div>

        <div className="p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{listing.title}</h2>
              <p className="text-white/60 flex items-center gap-2">
                <MapPin size={18} /> {listing.district?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-indigo-400">
                {new Intl.NumberFormat("tr-TR").format(listing.price)} ₺
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <InfoBox label="📦 Kategori" value={listing.category?.name} />
            <InfoBox label="📍 Adres" value={listing.address} />
            <InfoBox label="👤 İlan Sahibi" value={listing.owner?.username} />

            {listing.agent && (
              <InfoBox label="🏢 Emlakçı" value={listing.agent?.username} />
            )}
            <InfoBox
              label="📅 Yayınlanma"
              value={new Date(listing.createdAt).toLocaleDateString("tr-TR")}
            />
            <InfoBox
              label="📞 Emlakçı İle İletişime Geç"
              value={listing.agent?.email}
            />
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-3">📝 Açıklama</h3>
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          <div className="flex gap-4">
            {user && (
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                  isFavorite
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Heart
                  size={20}
                  fill={isFavorite ? "currentColor" : "none"}
                />
                {loading
                  ? "İşleniyor..."
                  : isFavorite
                  ? "Favorilerden Çıkar"
                  : "Favorilere Ekle"}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-white/60 text-sm mb-1">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}