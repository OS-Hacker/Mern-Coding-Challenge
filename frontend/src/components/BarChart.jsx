import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import styled from "styled-components";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ selectedMonth }) => {
  const [barData, setBarData] = useState([]);

  console.log(barData);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/bar-chart?month=${selectedMonth}`
        );
        setBarData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  const data = {
    labels: barData?.priceRanges?.map(
      (range, idx) => `${idx}: ${range.priceRange}`
    ),
    datasets: [
      {
        label: "Number of items",
        data: barData?.priceRanges?.map((range) => range.count),
        backgroundColor: "rgba(75, 192, 134, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Wrapper>
      <div className="container">
        <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
        <h3 style={{ textAlign: "center" }}>
          Bar Chart Stats - {barData?.currentMonth}
        </h3>
        <Bar data={data} />
      </div>
    </Wrapper>
  );
};

export default BarChart;

const Wrapper = styled.section`
  .container {
    width: 800px;
    margin: 50px auto;
    background-color: white;
    padding: 10px;
  }
`;
