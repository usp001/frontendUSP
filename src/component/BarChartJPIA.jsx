import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarJpiaChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("https://backend-production-fc3a.up.railway.app/api/financial/chart-fr");
        const data = response.data.data;

        // Update the chart data
        setChartData({
          labels: ["CTHM",
        "CCST",
        "CTED",
        "CAS",
        "CHK",
        "COE",
        "COA",
        "CNHS"], // Customize labels as needed
          datasets: [
            {
              label: "Financial Report poinsts",
              data: data,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Financial Reports",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 ,width:'100%'}}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Financial Reports Overview
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </CardContent>
    </Card>
  );
};

export default BarJpiaChart;
