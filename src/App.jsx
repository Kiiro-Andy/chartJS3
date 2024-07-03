import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from 'axios';
import './App.css';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const API_KEY = '98423Q2GXZ3BF3RN';

const App = () => {
  const [forexData, setForexData] = useState({});
  const [indicatorsData, setIndicatorsData] = useState({});
  const [bmvData, setBmvData] = useState({});
  const [usStockData, setUsStockData] = useState({});

  useEffect(() => {
    const fetchForexData = async () => {
      const response = await axios.get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=MXN&to_symbol=USD&apikey=${API_KEY}`);
      setForexData(response.data['Time Series FX (Daily)'] || {});
    };

    const fetchIndicatorsData = async () => {
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=^MXX&apikey=${API_KEY}`);
      setIndicatorsData(response.data['Global Quote'] || {});
    };

    const fetchBMVData = async () => {
      const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^MXX&apikey=${API_KEY}`);
      setBmvData(response.data['Time Series (Daily)'] || {});
    };

    const fetchUSStockData = async () => {
      const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&apikey=${API_KEY}`);
      setUsStockData(response.data['Time Series (Daily)'] || {});
    };

    fetchForexData();
    fetchIndicatorsData();
    fetchBMVData();
    fetchUSStockData();
  }, []);

  return (
    <div className='App'>
      <div className='dataCard forexCard'>
        <Line data={{
          labels: Object.keys(forexData),
          datasets: [
            {
              label: "MXN/USD Exchange Rate",
              data: Object.values(forexData).map(value => value['4. close']),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
            },
          ],
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
            },
          },
          plugins: {
            title: {
              text: "MXN/USD Daily Exchange Rate",
            },
          },
        }}
        />
      </div>

      <div className='dataCard indicatorsCard'>
        <Bar
          data={{
            labels: ['Open', 'High', 'Low', 'Price', 'Volume'],
            datasets: [
              {
                label: "Indicators",
                data: [
                  indicatorsData['02. open'] || 0,
                  indicatorsData['03. high'] || 0,
                  indicatorsData['04. low'] || 0,
                  indicatorsData['05. price'] || 0,
                  indicatorsData['06. volume'] || 0
                ],
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)"
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "BMV Indicators",
              },
            },
          }}
        />
      </div>

      <div className='dataCard comparisonCard'>
        <Doughnut
          data={{
            labels: Object.keys(bmvData).slice(0, 7), // Últimos 7 días
            datasets: [
              {
                label: "BMV",
                data: Object.values(bmvData).slice(0, 7).map(value => value['4. close']),
                backgroundColor: "rgba(43, 63, 229, 0.8)",
                borderColor: "rgba(43, 63, 229, 0.8)",
              },
              {
                label: "US Stock",
                data: Object.values(usStockData).slice(0, 7).map(value => value['4. close']),
                backgroundColor: "rgba(253, 135, 135, 0.8)",
                borderColor: "rgba(253, 135, 135, 0.8)",
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "BMV vs US Stock Market",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default App;
