import { useState } from "react";
import AuthModal from "../components/AuthModal";
import Login from "./auth/Login";
import Register from "./auth/Register";

import { useAuth } from "../context/AuthContext";

//import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user,logout  } = useAuth();
  //const token = localStorage.getItem("accessToken");

  return (
    <div className="min-h-screen bg-gray-400">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        {/*eger sidebar simgesine bastıysak gizlensin*/}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-6 left-6 z-50 text-white text-3xl"
          >
            ☰
          </button>
        )}

        
        <div className="absolute top-0 right-0 z-10 p-6 text-white">
            <h2 className ="text-5xl font-serif italic text-white">
                vesta   {/*SİTE ADI*/}
            </h2>
        </div>  

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Hayalindeki Evi <br /> Kolayca Bul
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Ev sahipleri, emlakçılar ve müşteriler için
            güvenilir, hızlı ve modern emlak platformu.
          </p>
{/*logout login falan kısmı burada */}
          {!user && (
  <div className="flex flex-col md:flex-row gap-4 justify-center">
    <button 
      onClick={() => setShowLogin(true)}
      className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition">
      Giriş Yap
    </button>

    <button 
      onClick={() => setShowRegister(true)} 
      className="bg-gray-400 text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition">
      Kayıt Ol
    </button>
    
  </div>
)}


        </div>
      </section>

      {/* ROLLER */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Kimler İçin?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Müşteriler</h3>
            <p className="text-gray-600">
              İlçe ve konut tipine göre evleri incele,
              güvenilir emlakçılarla hızlıca iletişime geç.
            </p>
          </div>

          <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Emlakçılar</h3>
            <p className="text-gray-600">
              Sana atanan müşterilerle çalış,
              komisyon sistemini şeffaf şekilde yönet.
            </p>
          </div>

          <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Ev Sahipleri</h3>
            <p className="text-gray-600">
              Evini ekle, fiyatını güncelle,
              ilanını dilediğin zaman yönet.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p>© 2025 Emlak Sistemi. Tüm hakları saklıdır.</p>
      </footer>


      {/*authmodel için kısım*/}
      <AuthModal open={showLogin} onClose={() => setShowLogin(false)}>
        <Login 
          onSuccess={() => {
          setShowLogin(false);
          }}
        />
      </AuthModal>

      <AuthModal open={showRegister} onClose={() => setShowRegister(false)}>
        <Register
          onSuccess={() => {
          setShowRegister(false);
          }}  
         />
      </AuthModal>

    </div>
  );
}
