// src/components/Analytics.js
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Dummy data for now
    const dummyData = {
      labels: ["Product A", "Product B", "Product C"],
      datasets: [
        {
          label: "Number of Returns",
          data: [5, 2, 7], // Example dummy data
          backgroundColor: ["#4ade80", "#60a5fa", "#f87171"]
        }
      ]
    };

    setChartData(dummyData);
  }, []);

  if (!chartData) return <p>Loading analytics...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Product Return Analytics</h2>
      <Bar 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Returns per Product"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1
            }
          }
        }} 
      />
    </div>
  );
};

export default Analytics;
