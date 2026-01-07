import { Home, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios"; // 👈 api kullan

export default function MyListings() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentListingCounts, setAgentListingCounts] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    categoryId: "",
    districtId: "",
    agentId: "",
    status: "ACTIVE",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyListings();
      fetchCategories();
      fetchDistricts();
      fetchAgents();
    }
  }, [user]);

  const fetchMyListings = async () => {
    try {
      const response = await api.get("/listings/my/listings");
      setMyListings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("İlanlar yüklenemedi:", err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Kategoriler yüklenemedi:", err);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await api.get("/districts");
      setDistricts(response.data);
    } catch (err) {
      console.error("İlçeler yüklenemedi:", err);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get("/users/agents");
      setAgents(response.data);

      // Her emlakçının kaç ilanı olduğunu hesapla
      const allListings = await api.get("/listings");
      const counts = {};
      allListings.data.forEach((listing) => {
        if (listing.agentId) {
          counts[listing.agentId] = (counts[listing.agentId] || 0) + 1;
        }
      });
      setAgentListingCounts(counts);
    } catch (err) {
      console.error("Emlakçılar yüklenemedi:", err);
    }
  };

  const calculateCommission = (price) => {
    return (Number(price) * 0.03).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.price || !form.address || !form.categoryId || !form.districtId) {
      alert("⚠️ Lütfen tüm alanları doldurun");
      return;
    }

    if (form.agentId) {
      const count = agentListingCounts[form.agentId] || 0;
      if (count >= 5 && !editingListing) {
        alert("❌ Bu emlakçı maksimum 5 ilan limitine ulaştı. Başka bir emlakçı seçin.");
        return;
      }
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("address", form.address);
    data.append("categoryId", form.categoryId);
    data.append("districtId", form.districtId);
    data.append("status", form.status);
    if (form.agentId) data.append("agentId", form.agentId);
    if (image) data.append("image", image);

    try {
      if (editingListing) {
        await api.put(`/listings/${editingListing.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ İlan güncellendi!");
      } else {
        await api.post("/listings", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("✅ İlan oluşturuldu!");
      }

      setShowModal(false);
      setEditingListing(null);
      resetForm();
      fetchMyListings();
      fetchAgents();
    } catch (err) {
      alert("❌ İşlem başarısız: " + (err.response?.data?.message || ""));
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      address: listing.address,
      categoryId: listing.categoryId,
      districtId: listing.districtId,
      agentId: listing.agentId || "",
      status: listing.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/listings/${id}`);
      alert("🗑️ İlan silindi!");
      fetchMyListings();
      fetchAgents();
    } catch (err) {
      alert("❌ Silme başarısız");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      address: "",
      categoryId: "",
      districtId: "",
      agentId: "",
      status: "ACTIVE",
    });
    setImage(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <section className="relative h-[90vh] flex items-center justify-center">
          <img
            src="https://sirdas.com.tr/storage/projects/2.jpg"
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
            <h1 className="text-3xl font-bold mb-8 ml-9 -mt-0">Benim İlanlarım</h1>
          </div>

          <p className="text-xl animate-pulse text-white">Henüz Giriş Yapmadınız.</p>

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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold ml-7 -mt-5">Benim İlanlarım ({myListings.length})</h1>

        <button
          onClick={() => {
            setEditingListing(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
        >
          <PlusCircle size={18} />
          Yeni İlan
        </button>
      </div>

      {myListings.length === 0 ? (
        <EmptyState onCreateClick={() => setShowModal(true)} />
      ) : (
        <ListingsGrid listings={myListings} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl my-8">
            <h3 className="text-2xl font-bold mb-6 text-indigo-500">
              {editingListing ? "İlanı Düzenle" : "Yeni İlan Oluştur"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="İlan Başlığı"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                placeholder="Açıklama"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="number"
                placeholder="Fiyat (₺)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {form.price && form.agentId && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
                  <p className="text-green-400 font-semibold">
                    💰 Emlakçı Komisyonu: {new Intl.NumberFormat("tr-TR").format(calculateCommission(form.price))} ₺
                  </p>
                  <p className="text-green-300 text-sm mt-1">
                    (Fiyatın %3'ü - Satılırsa emlakçı bu tutarı kazanır)
                  </p>
                </div>
              )}

              <input
                type="text"
                placeholder="Adres"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={form.districtId}
                onChange={(e) => setForm({ ...form, districtId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">İlçe Seçin</option>
                {districts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emlakçı Seçin (İsteğe Bağlı)
                </label>
                <select
                  value={form.agentId}
                  onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Emlakçı Seçmeyin (Kendi İlanım)</option>
                  {agents.map((agent) => {
                    const count = agentListingCounts[agent.id] || 0;
                    const isFull = count >= 5;
                    return (
                      <option key={agent.id} value={agent.id} disabled={isFull && !editingListing}>
                        {agent.username} ({count}/5 ilan) {isFull ? "- DOLU ❌" : "✅"}
                      </option>
                    );
                  })}
                </select>
                <p className="text-white/60 text-xs mt-2">
                  ℹ️ Her emlakçı maksimum 5 ilan alabilir. Seçtiğiniz emlakçı %3 komisyon kazanır.
                </p>
              </div>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ACTIVE">Aktif</option>
                <option value="SOLD">Satıldı</option>
                <option value="RENTED">Kiralandı</option>
              </select>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fotoğraf Yükle (İsteğe Bağlı)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full px-4 py-2 rounded-xl bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingListing(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 transition font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
                >
                  {editingListing ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <Home size={40} />
      </div>

      <h2 className="text-2xl font-semibold mb-2">Henüz bir ilanınız yok</h2>

      <p className="text-white/60 max-w-md mb-6">
        Evlerinizi ekleyerek kiralama veya satışa hemen başlayabilirsiniz.
      </p>

      <button
        onClick={onCreateClick}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition font-semibold"
      >
        İlk İlanını Oluştur
      </button>
    </div>
  );
}

function ListingsGrid({ listings, onEdit, onDelete }) {
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

            <span className="block mt-2 font-bold text-indigo-400">
              {new Intl.NumberFormat("tr-TR").format(item.price)} ₺
            </span>

            {item.agent && (
              <p className="text-green-400 text-xs mt-2">
                🏢 Emlakçı: {item.agent.username} | Komisyon: {new Intl.NumberFormat("tr-TR").format(item.commission)} ₺
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
              >
                <Edit2 size={16} />
                Düzenle
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Sil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}