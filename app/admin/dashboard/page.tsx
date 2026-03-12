"use client";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";   // ✅ added

export default function AdminDashboard() {
  const router = useRouter();                  // ✅ added
  const [loading, setLoading] = useState(true); // ✅ added

  const [form, setForm] = useState({
    type: "image",
    title: "",
    description: "",
    tags: "",
    link: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      // 1. Upload file to Cloudinary (or your upload API)
      const data = new FormData();
      data.append("file", file);

      const uploadRes = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: data,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) {
        toast.error("Upload failed");
        return;
      }

      // 2. Save metadata + Cloudinary URL in DB
      await fetch("/api/portfolio/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          description: form.description,
          tags: form.tags.split(",").map((t) => t.trim()),
          link: form.link,
          url: uploadData.secure_url,
        }),
      });

      // Reset form
      setForm({
        type: "image",
        title: "",
        description: "",
        tags: "",
        link: "",
      });
      setFile(null);

      // Refresh items
      fetchItems();

      // ✅ Show success toast
      toast.success("Portfolio item added successfully!");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fetchItems = async () => {
    const res = await fetch("/api/portfolio/list");
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    // ✅ Authentication check
    const token = localStorage.getItem("token"); // or use cookies
    if (!token) {
      router.push("/login"); // redirect if not logged in
    } else {
      setLoading(false);
      fetchItems();
    }
  }, [router]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Checking authentication...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4"
        >
          {/* form inputs unchanged */}
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border rounded-lg p-2"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="Project Link"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full border rounded-lg p-2"
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Upload & Save
          </button>
        </form>

        {/* Display Portfolio Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {item.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="rounded-lg w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  controls
                  className="rounded-lg w-full h-48 object-cover"
                />
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 text-sm font-medium mt-2 inline-block"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
