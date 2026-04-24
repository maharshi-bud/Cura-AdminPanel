import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  ArcElement,
  Legend
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// 🎨 COMMON OPTIONS
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top"
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#f1f5f9" }, beginAtZero: true }
  }
};

const normalizeChartData = (data) => (Array.isArray(data) ? data : []);

// ✅ NORMAL BAR (Plan / Revenue / etc.)
export function PlanChart({ data, label = "Users" }) {
  const chartData = normalizeChartData(data);

  return (
    <Bar
      data={{
        labels: chartData.map(d => d.name),
        datasets: [{
          label: label,
          data: chartData.map(d => d.value),
          backgroundColor: "#1f8a78",
          borderRadius: 8
        }]
      }}
      options={baseOptions}
    />
  );
}

// ✅ PAYMENT
export function PaymentChart({ data }) {
  const chartData = normalizeChartData(data);

  return (
    <Bar
      data={{
        labels: chartData.map(d => d.name),
        datasets: [{
          label: "Payments",
          data: chartData.map(d => d.value),
          backgroundColor: "#4f46e5",
          borderRadius: 8
        }]
      }}
      options={baseOptions}
    />
  );
}

// ✅ LINE (Registrations)
export function DailyChart({ data }) {
  const chartData = normalizeChartData(data);

  return (
    <Line
      data={{
        labels: chartData.map(d => d.name),
        datasets: [{
          label: "Registrations",
          data: chartData.map(d => d.value),
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.15)",
          fill: true,
          tension: 0.4,
          pointRadius: 3
        }]
      }}
      options={baseOptions}
    />
  );
}

// ✅ DOUGHNUT
export function DoughnutChart({ data }) {
  const chartData = normalizeChartData(data);

  return (
    <Doughnut
      data={{
        labels: chartData.map(d => d.name),
        datasets: [{
          data: chartData.map(d => d.value),
          backgroundColor: [
            "#4f46e5",
            "#1f8a78",
            "#f59e0b"
          ],
          borderWidth: 0
        }]
      }}
      options={{
        plugins: {
          legend: {
            position: "bottom",
            labels: { usePointStyle: true }
          }
        },
        cutout: "70%"
      }}
    />
  );
}

// ✅ STACKED BAR (for expiry per plan)
export function StackedBarChart({ data }) {
  return (
    <Bar
      data={data}
      options={{
        ...baseOptions,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }}
    />
  );
}
