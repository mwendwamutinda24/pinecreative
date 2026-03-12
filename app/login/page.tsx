"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter(); 

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } else {
      toast.error(data.error || "Invalid login credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center text-orange-800 mb-6 font-serif">
          Login to Pinecreative
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-sans"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
