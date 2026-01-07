import { DollarSign, Home, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Commissions() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === "AGENT") {
      fetchMyCommissions();
    }
  }, [user]);

  const fetchMyCommissions = async () => {
    try {
      const response = await api.get("/listings/agent/my-commissions");
      setMyListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Komisyonlar yüklenemedi:", err);
      setLoading(false);
    }
  };

  const totalCommission = myListings
    .filter((l) => l.status === "SOLD" || l.status === "RENTED")
    .reduce((sum, l) => sum + Number(l.commission), 0);

  const pendingCommission = myListings
    .filter((l) => l.status === "ACTIVE")
    .reduce((sum, l) => sum + Number(l.commission), 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <section className="relative h-[90vh] flex items-center justify-center">
          <img
            src="https://sirdas.com.tr/storage/projects/4.jpg"
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
            <h1 className="text-3xl font-bold mb-8 ml-9 -mt-0">Komisyonlarım</h1>
          </div>

          <p className="text-xl animate-pulse text-white">Henüz Giriş Yapmadınız.</p>

          <div className="absolute top-0 right-0 z-10 p-6 text-white">
            <h2 className="text-5xl font-serif italic text-white">vesta</h2>
          </div>
        </section>
      </div>
    );
  }

  if (user.role !== "AGENT") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">⛔ Erişim Engellendi</h1>
          <p className="text-white/60 mb-6">
            Bu sayfayı sadece emlakçılar görüntüleyebilir.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Ana Sayfaya Dön
          </button>
        </div>
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

      <h1 className="text-3xl font-bold mb-8 ml-7 -mt-2">Komisyonlarım</h1>

      {/* İstatistik Kartları */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<DollarSign />}
          title="Kazanılan Komisyon"
          value={`${new Intl.NumberFormat("tr-TR").format(totalCommission)} ₺`}
          color="green"
        />
        <StatCard
          icon={<TrendingUp />}
          title="Bekleyen Komisyon"
          value={`${new Intl.NumberFormat("tr-TR").format(pendingCommission)} ₺`}
          color="yellow"
        />
        <StatCard
          icon={<Home />}
          title="Toplam İlan"
          value={myListings.length}
          color="blue"
        />
      </div>

      {/* İlan Listesi */}
      {myListings.length === 0 ? (
        <EmptyState />
      ) : (
        <CommissionsGrid listings={myListings} />
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-orange-500",
    blue: "from-blue-500 to-indigo-500",
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-white/60 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <DollarSign size={40} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">Henüz komisyon yok</h2>

      <p className="text-white/60 max-w-md">
        Size atanmış ilanlar burada listelenecek. İlanlar satılınca komisyon
        kazanacaksınız.
      </p>
    </div>
  );
}

function CommissionsGrid({ listings }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((item) => (
        <div
          key={item.id}
          className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition"
        >
          {item.image ? (
            <img
              src={`${API_URL}${item.image}`}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Home size={48} className="text-white/40" />
            </div>
          )}

          <div className="p-4">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-white/60 text-sm">{item.district?.name}</p>

            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Fiyat:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("tr-TR").format(item.price)} ₺
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Komisyon:</span>
                <span className="font-bold text-green-400">
                  {new Intl.NumberFormat("tr-TR").format(item.commission)} ₺
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/60 text-sm">Durum:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "SOLD"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "RENTED"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {item.status === "SOLD"
                    ? "✅ Satıldı"
                    : item.status === "RENTED"
                    ? "🟡 Kiralandı"
                    : "🔵 Aktif"}
                </span>
              </div>
            </div>

            {item.status === "ACTIVE" && (
              <p className="text-white/40 text-xs mt-3">
                💡 İlan satılınca komisyonu kazanacaksınız
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}