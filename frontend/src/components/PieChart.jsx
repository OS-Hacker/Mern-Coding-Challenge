import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import styled from "styled-components";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedMonth }) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchPieChartData();

    // Cleanup function to destroy the chart
    return () => {
      if (Chart.instances.length > 0) {
        Chart.instances.forEach((chartInstance) => chartInstance.destroy());
      }
    };
  }, [selectedMonth]);

  console.log(pieData);

  const fetchPieChartData = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/pie-chart?month=${selectedMonth}`
    );
    setPieData(data);
  };

  console.log("pieChart",pieData)

  const data = {
    labels: pieData?.categoryCounts?.map((category) => category.category),
    datasets: [
      {
        data: pieData.categoryCounts?.map((category) => category.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="pie">
          <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
          <h3 style={{ textAlign: "center" }}>
            Pie Chart Stats - {pieData?.currentMonth}
          </h3>
          <Pie data={data} />
        </div>
      </div>
    </Wrapper>
  );
};

export default PieChart;

const Wrapper = styled.section`
  .container {
    width: 800px;
    margin: 50px auto;
    background-color: white;
    padding: 10px;
  }

  .pie {
    width: 300px;
    margin: auto;
  }
`;
