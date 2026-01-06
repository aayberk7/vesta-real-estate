import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Account from "../pages/account/Account";
import Listings from "../pages/listings/Listings";
import MyListings from "../pages/listings/MyListings";
import Favorites from "../pages/listings/Favorites";
import Commissions from "../pages/agent/Commissions";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/commissions" element={<Commissions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;


