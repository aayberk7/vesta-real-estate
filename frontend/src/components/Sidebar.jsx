import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  



export default function Sidebar({ open, onClose }) {
  
  if (!open) return null;
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-64 bg-gray-500 shadow-xl p-6 flex flex-col space-y-4">
        <h2 className="text-xl font-bold mb-6">Menü</h2>

        {/*alt alta yazdırmak için bu sekil yazdım.*/}
        <Link 
            to="/" 
            onClick={onClose}
            className = "hover:text-blue-600"
        >   
            Ana Sayfa
        </Link>
        <Link 
            to="/account" 
            onClick={onClose}
            className = "hover:text-blue-600"
        >   
            Hesabım
        </Link>

        <Link to="/listings" onClick={onClose} className = "hover:text-blue-600">Ev İlanları</Link>
        <Link to="/my-listings" onClick={onClose} className = "hover:text-blue-600">Benim İlanlarım</Link>
        <Link to="/favorites" onClick={onClose} className = "hover:text-blue-600">Favorilerim</Link>
        <Link to="/commissions" onClick={onClose} className = "hover:text-blue-600">Komisyonlarım</Link>
        
      </div>
      {user && (
        <button
          onClick={handleLogout}
          className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition z-50 shadow-lg "
        >
          Çıkış Yap
        </button>
      )}
    </div>
    
  );
}
