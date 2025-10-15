import React, { useEffect, useState } from "react";
import api from "../api";

export default function RequestedReturns() {
  const [returns, setReturns] = useState([]);
  const [selected, setSelected] = useState(null);

  // Load returns on mount
  useEffect(() => load(), []);

  function load() {
    api.get("/api/returns")
      .then(r => setReturns(r.data || []))
      .catch(err => {
        console.error("Error loading returns:", err);
        alert("Failed to load returns. Check backend server.");
      });
  }

  function open(r) {
    setSelected(r);
  }

  function close() {
    setSelected(null);
  }

  function respond(status) {
    if (!selected) return;

    api.put("/api/returns", { id: selected.id, status }, {
      headers: { "Content-Type": "application/json" }
    })
      .then(r => {
        alert("Return status updated!");
        load();
        close();
      })
      .catch(err => {
        console.error("Error updating return:", err);
        alert("Failed to update return. Check backend console.");
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Requested Returns</h2>

      <div className="bg-white p-4 rounded shadow">
        <ul>
          {returns.map(r => (
            <li key={r.id} className="py-3 border-b flex justify-between items-center">
              <div>
                <div className="font-medium">{r.product}</div>
                <div className="text-sm text-gray-500">
                  Order: {r.orderId} • Status: {r.status}
                </div>
              </div>
              <div>
                <button
                  onClick={() => open(r)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Open
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-3/4 max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-2">Return #{selected.id}</h3>
            <p><strong>Product:</strong> {selected.product}</p>
            <p><strong>Order ID:</strong> {selected.orderId}</p>
            <p><strong>Reason:</strong> {selected.reason}</p>

            <div className="mt-4">
              <h4 className="font-medium">AI Analysis</h4>
              <div className="mt-2 p-3 border rounded bg-gray-50">
                <div>
                  <strong>Status:</strong>{" "}
                  {selected.ai?.approved === true
                    ? <span className="text-green-600">Approved</span>
                    : selected.ai?.approved === false
                      ? <span className="text-red-600">Rejected</span>
                      : <span className="text-yellow-600">Pending/Manual review</span>}
                </div>
                <div className="mt-1">
                  <strong>Score:</strong> {selected.ai?.score ?? "—"}
                </div>
                <div className="mt-1">
                  <strong>Notes:</strong> {selected.ai?.notes || "No notes"}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              {selected.files?.map((f, i) => (
                <div key={i} className="border p-2">
                  <img
                    src={api.defaults.baseURL + f}
                    alt={"file-" + i}
                    className="max-w-full max-h-48"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => respond("accepted")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => respond("declined")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Decline
              </button>
              <button
                onClick={close}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
