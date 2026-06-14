"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Tooltip
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
);

export const chartTextColor = "rgba(255,255,255,0.72)";
export const chartGridColor = "rgba(30,215,96,0.16)";

export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: chartTextColor,
        font: {
          family: "JetBrains Mono"
        }
      }
    },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.92)",
      borderColor: "#1ED760",
      borderWidth: 1,
      titleColor: "#1ED760",
      bodyColor: "#ffffff"
    }
  }
};
