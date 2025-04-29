import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductivityChart = () => {
  // Define the chart data structure
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Goals Completed",
        data: [10, 20, 30, 40], // Replace with dynamic data
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options for responsive behavior
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Productivity Over Time',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl mb-4">Productivity Chart</h3>
      {/* Render the Line chart */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProductivityChart;
