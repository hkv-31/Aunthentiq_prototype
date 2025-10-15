import React, { useEffect, useState } from "react";
import api from "../api";
import ReturnForm from "./ReturnForm";

export default function CustomerSite({ switchToSeller }){
  const [seller, setSeller] = useState({});
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    api.get("/api/seller").then(r=> setSeller(r.data));
    api.get("/api/products").then(r=> setProducts(r.data));
    api.get("/api/orders").then(r=> setOrders(r.data));
  },[]);

  function order(product){
    // create simple order and refresh
    api.post("/api/orders", { product, buyer: "Guest", address: "N/A" }).then(r=>{
      alert("Order created: " + r.data.id);
      api.get("/api/orders").then(r=> setOrders(r.data));
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{color: seller.color || "#111"}} className="text-3xl font-bold">{seller.shop || "Storefront"}</h1>
          <p className="text-gray-600">{seller.description}</p>
        </div>
        <div>
          <button onClick={switchToSeller} className="bg-gray-800 text-white px-3 py-2 rounded">Back to Seller</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p=> (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="h-40 bg-gray-100 flex items-center justify-center mb-4">
              {p.photo ? <img src={api.defaults.baseURL + p.photo} alt={p.name} className="max-h-full max-w-full"/> : <div className="text-gray-400">No Photo</div>}
            </div>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-500">₹{p.price}</div>
            <div className="text-sm text-gray-600 mb-2">{p.caption}</div>
            <div className="flex gap-2">
              <button onClick={()=>order(p)} className="bg-teal-600 text-white px-3 py-1 rounded">Order product</button>
              <button onClick={()=>setSelected(p)} className="bg-gray-200 px-3 py-1 rounded">Request Return</button>
            </div>
          </div>
        ))}
      </div>

      {selected && <ReturnForm product={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
