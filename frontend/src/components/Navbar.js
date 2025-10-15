import React from "react";

export default function Navbar({ setPage, setMode }){
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">AuthentIQ</h1>
        <p className="text-sm text-gray-500">Ananya's Login</p>
      </div>

      <nav className="p-4 space-y-2">
        <button onClick={()=>setPage("dashboard")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Dashboard</button>
        <button onClick={()=>setPage("tracker")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Tracker</button>
        <button onClick={()=>setPage("products")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Products</button>
        <button onClick={()=>setPage("returns")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Requested Returns</button>
        <button onClick={()=>setPage("analytics")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Analytics</button>
      </nav>

      <div className="p-4 mt-auto border-t">
        <button onClick={()=>setMode("customer")} className="w-full bg-teal-500 text-white py-2 rounded">Open Customer Site</button>
      </div>
    </aside>
  );
}
