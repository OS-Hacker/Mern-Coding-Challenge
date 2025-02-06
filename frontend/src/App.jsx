import React, { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3);

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Product Transactions</h1>

      <TransactionsTable
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      <Statistics selectedMonth={selectedMonth} />
      <BarChart selectedMonth={selectedMonth} />
      <PieChart selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
