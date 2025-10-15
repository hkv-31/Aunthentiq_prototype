// frontend/src/components/Tracker.js
import React, { useEffect, useState } from "react";
import api, { getDeliveryStatus, USE_FAKE_DELIVERY } from "../api";

// Leaflet + React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix default icon paths for leaflet in CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Tracker(){
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=> { loadOrders(); }, []);

  async function loadOrders(){
    try{
      const res = await api.get("/api/orders");
      setOrders(res.data || []);
    }catch(e){
      console.error("Failed to load orders", e);
      setOrders([]);
    }
  }

  async function refreshStatuses(){
    setRefreshing(true);
    const copy = [...orders];
    for (let i = 0; i < copy.length; i++){
      const o = copy[i];
      try{
        const resp = await getDeliveryStatus(o.id);
        if(resp && resp.data && resp.data.status) o.status = resp.data.status;
      }catch(err){
        console.warn("status fetch failed", err);
      }
    }
    setOrders(copy);
    setRefreshing(false);
  }

  // center India lat/lon
  const indiaCenter = [22.0, 80.0];
  const mapZoom = 4;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Tracker</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Delivery mode: <strong>{USE_FAKE_DELIVERY ? "FAKE" : "REAL"}</strong></div>
          <button onClick={refreshStatuses} className="bg-indigo-600 text-white px-3 py-1 rounded">
            {refreshing ? "Refreshing..." : "Refresh Statuses"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4 overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Order ID</th>
              <th>Product</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b">
                <td className="py-2">{o.id}</td>
                <td>{o.product?.name || "—"}</td>
                <td>{o.ts ? new Date((o.ts||0)*1000).toLocaleString() : "—"}</td>
                <td>{o.status || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Order map</h3>
        <MapContainer center={indiaCenter} zoom={mapZoom} style={{ height: 420, width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {orders.map((o, i) => {
            if (!o.lat || !o.lon) return null;
            return (
              <Marker key={o.id || i} position={[o.lat, o.lon]}>
                <Popup>
                  <div className="text-sm">
                    <div><strong>{o.product?.name}</strong></div>
                    <div>Order: {o.id}</div>
                    <div>Status: {o.status}</div>
                    <div>{o.address}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
