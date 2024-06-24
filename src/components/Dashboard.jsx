import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import 'chart.js/auto';

const Dashboard = ({ token }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  const mockData = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`), // Mock labels for 30 days
    datasets: [
      {
        label: 'Air Temperature (°C)',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 30) + 10), // Random temperatures between 10 and 40°C
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Air Temperature at Home Town for the Past Month',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
      },
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const getLastMOnthDate = (period) => {
    const today = new Date();

    if (period === 'month') {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return lastMonth;
    } else {
      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      return lastYear;
    }
  }


  useEffect(() => {
    const fetchData = async () => {

      let formattedDate = formatDate(getLastMOnthDate(period))
      try {
        const response = await axios.get('http://localhost:8082/fetch-weather', {
          headers: { Authorization: `Bearer ${token}` },
          params: { formattedDate },
        });
        debugger
        console.log('===============', response)
        setData(response?.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    fetchData();
  }, [period, token]);

  // const labels = data?.forecast?.forecastday[0]?.hour?.map(entry => entry.time);
  // const temperatures = data?.forecast?.forecastday[0]?.hour?.map(entry => entry.temp_c);


  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="period-buttons">
        <button onClick={() => setPeriod('month')}>Month</button>
        <button onClick={() => setPeriod('year')}>Year</button>
      </div>
      <Line data={mockData} options={options} />
      {loading && data !== null ? <p>Loading...</p> : <h1>sdkjfbdjh</h1>}
    </div>
  );
};

export default Dashboard;
