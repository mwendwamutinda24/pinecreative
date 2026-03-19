"use client";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    link: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length) {
      toast.error("Please select at least one file to upload");
      return;
    }

    try {
      // Build FormData with files + metadata
      const data = new FormData();
      files.forEach((file) => data.append("files", file));
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("link", form.link);
      form.tags.split(",").forEach((tag) => {
        if (tag.trim()) data.append("tags", tag.trim());
      });

      // Upload & save via API
      const uploadRes = await fetch("/api/portfolio/upload", {
        method: "POST",
        body: data,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error(uploadData.error || "Upload failed");
        return;
      }

      // Reset form
      setForm({ title: "", description: "", tags: "", link: "" });
      setFiles([]);

      // Refresh items
      fetchItems();

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
    fetchItems();
  }, []);

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
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded-lg p-2"
            required
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
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
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

              {/* Render multiple images */}
              {item.images?.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={item.title}
                  className="rounded-lg w-full h-48 object-cover mb-2"
                />
              ))}

              {/* Render multiple videos */}
              {item.videos?.map((vid: string, i: number) => (
                <video
                  key={i}
                  src={vid}
                  controls
                  className="rounded-lg w-full h-48 object-cover mb-2"
                />
              ))}

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
