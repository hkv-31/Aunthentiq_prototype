import React, { useEffect, useState } from "react";
import api from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product to edit
  const [form, setForm] = useState({ name: "", price: "", caption: "", photo: null });

  useEffect(() => loadProducts(), []);

  function loadProducts() {
    api.get("/api/products")
      .then(res => setProducts(res.data || []))
      .catch(err => console.error(err));
  }

  // Handle form field changes
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) setForm(prev => ({ ...prev, [name]: files[0] }));
    else setForm(prev => ({ ...prev, [name]: value }));
  }

  // Add or update product
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (editing) {
        // PUT update
        res = await api.put("/api/products", { id: editing.id, ...form, photo: editing.photo });
      } else {
        // POST add new product
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("caption", form.caption);
        if (form.photo) formData.append("photo", form.photo);

        res = await api.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      alert(editing ? "Product updated" : "Product added");
      setForm({ name: "", price: "", caption: "", photo: null });
      setEditing(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    }
  }

  // Delete a product
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products?id=${id}`);
      alert("Deleted");
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  // Edit a product
  function handleEdit(p) {
    setEditing(p);
    setForm({ name: p.name, price: p.price, caption: p.caption, photo: null });
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <form className="bg-white p-4 rounded shadow mb-6" onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            name="caption"
            placeholder="Caption"
            value={form.caption}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <input type="file" name="photo" onChange={handleChange} />
          {editing && editing.photo && (
            <img src={api.defaults.baseURL + editing.photo} alt="current" className="mt-2 max-h-32" />
          )}
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: "", price: "", caption: "", photo: null }) }}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white p-4 rounded shadow">
        <ul>
          {products.map(p => (
            <li key={p.id} className="py-3 border-b flex justify-between items-center">
              <div>
                <div className="font-medium">{p.name} - ₹{p.price}</div>
                <div className="text-sm text-gray-500">{p.caption}</div>
              </div>
              <div className="flex gap-2 items-center">
                {p.photo && (
                  <img src={api.defaults.baseURL + p.photo} alt={p.name} className="max-h-16" />
                )}
                <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
