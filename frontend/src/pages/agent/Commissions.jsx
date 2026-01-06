import { useAuth } from "../../context/AuthContext";
import { Briefcase, Lock, TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

export default function Commissions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, token } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.role === "AGENT" || user.role === "agent")) {
      fetchCommissions();
    }
  }, [user]);

  const fetchCommissions = async () => {
    try {
      const response = await axios.get("http://localhost:3000/listings/agent/my-commissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommissions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Komisyonlar yüklenemedi:", err);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 ">
        <section className="relative h-[90vh] flex items-center justify-center">
          <img
            src="https://sirdas.com.tr/storage/projects/1.jpg"
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

          <p className="text-xl animate-pulse text-white">Henüz Giriş Yapmadınız.</p>
          <div className="absolute top-0 left-0 z-10 p-6 text-white">
            <h1 className="text-3xl font-bold mb-8 ml-9 -mt-0">Komisyonlarım</h1>
          </div>

          <div className="absolute top-0 right-0 z-10 p-6 text-white">
            <h2 className="text-5xl font-serif italic text-white">vesta</h2>
          </div>
        </section>
      </div>
    );
  }

  if (user.role !== "AGENT" && user.role !== "agent") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <Lock size={50} className="mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Bu sayfaya erişiminiz yok</h2>
        <p className="text-white/60">Komisyon bilgileri sadece emlakçılar için görüntülenebilir.</p>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 text-white text-3xl"
          >
            ☰
          </button>
        )}
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

  // İstatistikler hesapla
  const activeCommissions = commissions.filter((c) => c.status === "ACTIVE");
  const soldCommissions = commissions.filter((c) => c.status === "SOLD");
  const totalPending = activeCommissions.reduce((sum, c) => sum + Number(c.commission), 0);
  const totalEarned = soldCommissions.reduce((sum, c) => sum + Number(c.commission), 0);

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

      {/* İSTATİSTİKLER */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Briefcase />}
          title="Toplam İlan"
          value={commissions.length}
          color="indigo"
        />
        <StatCard
          icon={<Clock />}
          title="Bekleyen Komisyon"
          value={`${new Intl.NumberFormat("tr-TR").format(totalPending)} ₺`}
          color="yellow"
        />
        <StatCard
          icon={<TrendingUp />}
          title="Kazanılan Komisyon"
          value={`${new Intl.NumberFormat("tr-TR").format(totalEarned)} ₺`}
          color="green"
        />
      </div>

      {commissions.length === 0 ? (
        <EmptyState />
      ) : (
        <CommissionTable data={commissions} />
      )}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    indigo: "bg-indigo-500/20 text-indigo-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    green: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 flex items-center gap-4 backdrop-blur-md hover:bg-white/10 transition">
      <div className={`p-4 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-white/70">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

/* ---------------- EMPTY STATE ---------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <Briefcase size={50} className="mb-4 text-indigo-400" />
      <h2 className="text-2xl font-semibold mb-2">Henüz size atanmış ilan yok</h2>
      <p className="text-white/60">
        Müşteriler ilan oluştururken sizi emlakçı olarak seçtiğinde burada görünecek.
      </p>
    </div>
  );
}

/* ---------------- TABLE ---------------- */

function CommissionTable({ data }) {
  return (
    <div className="bg-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/10">
          <tr>
            <th className="p-4 text-left">İlan</th>
            <th className="p-4 text-left">İlan Sahibi</th>
            <th className="p-4 text-left">Fiyat</th>
            <th className="p-4 text-left">Komisyon (%3)</th>
            <th className="p-4 text-left">Durum</th>
            <th className="p-4 text-left">Tarih</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-t border-white/10 hover:bg-white/5 transition">
              <td className="p-4 font-semibold">{c.title}</td>
              <td className="p-4">{c.owner?.username}</td>
              <td className="p-4">{new Intl.NumberFormat("tr-TR").format(c.price)} ₺</td>
              <td className="p-4 font-semibold text-green-400">
                {new Intl.NumberFormat("tr-TR").format(c.commission)} ₺
              </td>
              <td className="p-4">
                {c.status === "ACTIVE" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
                    💤 Bekleniyor
                  </span>
                )}
                {c.status === "SOLD" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                    ✅ Kazanıldı
                  </span>
                )}
                {c.status === "RENTED" && (
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    🏠 Kiralandı
                  </span>
                )}
              </td>
              <td className="p-4 text-white/60">
                {new Date(c.createdAt).toLocaleDateString("tr-TR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOPLAM */}
      <div className="bg-white/10 p-4 flex justify-between items-center font-semibold">
        <span>TOPLAM</span>
        <div className="flex gap-6">
          <span className="text-yellow-400">
            Bekleyen: {new Intl.NumberFormat("tr-TR").format(
              data.filter((c) => c.status === "ACTIVE").reduce((sum, c) => sum + Number(c.commission), 0)
            )} ₺
          </span>
          <span className="text-green-400">
            Kazanılan: {new Intl.NumberFormat("tr-TR").format(
              data.filter((c) => c.status === "SOLD").reduce((sum, c) => sum + Number(c.commission), 0)
            )} ₺
          </span>
        </div>
      </div>
    </div>
  );
}