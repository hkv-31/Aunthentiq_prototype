import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import RequestedReturns from "./components/RequestedReturns";
import Analytics from "./components/Analytics";
import Tracker from "./components/Tracker";
import CustomerSite from "./components/CustomerSite";

export default function App(){
  const [page, setPage] = useState("dashboard");
  const [mode, setMode] = useState("seller"); // seller | customer

  if(mode === "customer"){
    return <CustomerSite switchToSeller={() => setMode("seller")} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar setPage={setPage} setMode={setMode}/>
      <main className="flex-1 p-6">
        {page === "dashboard" && <Dashboard />}
        {page === "tracker" && <Tracker />}
        {page === "products" && <Products />}
        {page === "returns" && <RequestedReturns />}
        {page === "analytics" && <Analytics />}
      </main>
    </div>
  );
}
