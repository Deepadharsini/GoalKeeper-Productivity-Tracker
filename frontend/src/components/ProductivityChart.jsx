import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductivityChart = ({ weeklyStats = [], goalsCompleted = 0, habitsCompleted = 0 }) => {
  // Fallback dummy data if no props passed
  const lineChartData = {
    labels: weeklyStats.map(stat => stat.week) || ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Goals Completed",
        data: weeklyStats.map(stat => stat.goalsCompleted) || [10, 20, 30, 40],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 1,
      },
      {
        label: "Habits Completed",
        data: weeklyStats.map(stat => stat.habitsCompleted) || [5, 15, 25, 35],
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderWidth: 1,
      }
    ],
  };

  const barChartData = {
    labels: ["Goals", "Habits"],
    datasets: [
      {
        label: "Total Completed",
        data: [goalsCompleted, habitsCompleted],
        backgroundColor: ["#4CAF50", "#2196F3"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Productivity Over Time' },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Total Goals and Habits Completed' },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
      <h3 className="text-xl mb-2">Productivity Chart</h3>
      <Line data={lineChartData} options={options} />
      <Bar data={barChartData} options={barOptions} />
    </div>
  );
};

export default ProductivityChart;
