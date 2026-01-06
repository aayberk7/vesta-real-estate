import { useState } from "react";
import { login as loginApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login({onSuccess}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginApi({ email, password });

    login(res.data.user, res.data.accessToken);
    onSuccess();
    alert("Giriş başarılı 🎉");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div >
        <h1 className="text-5xl md:text-4xl font-extrabold mb-6 ">HOŞGELDİNİZ</h1>
      </div>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />
      <button className="bg-black text-white w-full py-2">
        Giriş Yap
      </button>
    </form>
  );
}
