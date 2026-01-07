import { useState } from "react";
import { login as loginApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login({onSuccess}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginApi({ email, password });
      
      login(res.data.user, res.data.accessToken);
      alert("Giriş başarılı 🎉");
      onSuccess();
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Giriş başarısız! Email veya şifre hatalı.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h1 className="text-5xl md:text-4xl font-serif italic mb-6">
          VESTA'YA HOŞGELDİNİZ
        </h1>
      </div>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 w-full rounded"
      />
      <button className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition">
        Giriş Yap
      </button>
    </form>
  );
}