import React, { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard(){
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [money, setMoney] = useState(0);

  useEffect(()=>{
    api.get("/api/orders").then(r=> setOrders(r.data));
    api.get("/api/returns").then(r=> setReturns(r.data));
    api.get("/api/products").then(r=>{
      // compute dummy money earned using product price and orders (best-effort)
      api.get("/api/orders").then(or=>{
        let total = 0;
        or.data.forEach(o=>{
          if(o.product && o.product.id){
            const prod = r.data.find(p=>p.id === o.product.id);
            if(prod) total += (prod.price || 0);
          }
        });
        setMoney(total);
      });
    });
  },[]);

  // static/dummy for successful returns (for now)
  const successfulReturns = returns.filter(r=> r.status === "accepted").length || 2;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Money Earned (approx)</div>
          <div className="text-2xl font-bold">₹{money}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-gray-500">Successful Returns</div>
          <div className="text-2xl font-bold">{successfulReturns}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Recent Orders</h3>
        <ul>
          {orders.slice().reverse().slice(0,8).map(o => (
            <li key={o.id} className="py-2 border-b">
              <div className="flex justify-between">
                <div><strong>{o.product?.name || "Product"}</strong> — {o.buyer}</div>
                <div className="text-sm text-gray-500">{o.status}</div>
              </div>
              <div className="text-xs text-gray-400">{new Date((o.ts||0)*1000).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}