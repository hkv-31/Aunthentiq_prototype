import React, { useState } from "react";
import api from "../api";

export default function ReturnForm({ product, onClose }){
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [orderId, setOrderId] = useState("");

  async function submit(){
    if(!product || !orderId) return alert("Provide order ID");
    const fd = new FormData();
    fd.append("product", product.name);
    fd.append("orderId", orderId);
    fd.append("reason", reason);
    if(file) fd.append("file1", file);
    const res = await api.post("/api/returns", fd, { headers:{ "Content-Type": "multipart/form-data" }});
    alert("Return request submitted. AI notes: " + (res.data.ai?.notes || "none"));
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-2">Return: {product.name}</h3>
        <input className="border p-2 w-full mb-2" placeholder="Order ID" value={orderId} onChange={e=>setOrderId(e.target.value)} />
        <textarea className="border p-2 w-full mb-2" placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
        <input type="file" onChange={e=>setFile(e.target.files[0])} className="mb-4" />
        <div className="flex gap-2">
          <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
