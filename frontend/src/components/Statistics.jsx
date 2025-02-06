import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Statistics = ({ selectedMonth }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  console.log(stats);

  const fetchStatistics = async () => {
    const { data } = await axios.get(
      `http://localhost:8080/statistics?month=${selectedMonth}`
    );
    setStats(data);
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="sub_container">
          <h2>Statistics - {stats.month}</h2>
          <p>Total Sales: {stats.totalSales || 0}</p>
          <p>Sold Items: {stats.soldItems}</p>
          <p>Not Sold Items: {stats.unsoldItems}</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Statistics;

const Wrapper = styled.section`
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  .sub_container {
    width: 300px;
    border: 2px solid black;
    padding: 10px;
    border-radius: 10px;
    background-color: white;
  }
`;
