import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import SelectMonth from "./SelectMonth";

const TransactionsTable = ({ selectedMonth, setSelectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const per_page = 5;

  useEffect(() => {
    fetchTransactions();
  }, [search, page, selectedMonth]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `http://localhost:8080/transactions?search=${search}&page=${page}&per_page=${per_page}&month=${selectedMonth}`
      );
      setTransactions(data?.transactions);
      setTotalPages(data?.totalPages); // Set total pages from backend
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  console.log(transactions);

  return (
    <Wrapper>
      <div className="container">
        <div className="sub-container">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={handleSearchChange}
          />

          {/* select month */}
          <SelectMonth
            setSelectedMonth={setSelectedMonth}
            selectedMonth={selectedMonth}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Date</th>
              <th>image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const {
                  _id,
                  title,
                  description,
                  price,
                  category,
                  sold,
                  dateOfSale,
                  image,
                } = transaction;
                return (
                  <tr key={_id}>
                    <td>{title.substring(0, 30)}...</td>
                    <td>{description.substring(0, 50)}...</td>
                    <td>{price.toFixed(2)}</td>
                    <td>{category}</td>
                    <td>{sold ? "Yes" : "No"}</td>
                    <td>{new Date(dateOfSale).toLocaleDateString()}</td>
                    <td>
                      <img src={image} width="50px" height="50px" />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="sub_container-2">
          <div className="">
            <h3>Page No : {page}</h3>
          </div>
          <div className="pagination">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
          <div className="">
            <h3>Per Page : {per_page}</h3>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default TransactionsTable;

const Wrapper = styled.section`
  .container {
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .sub-container {
    width: 100%;
    margin: 20px auto;
    background-color: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 10vh;
  }

  .sub_container-2 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input[type="text"] {
    padding: 10px;
    width: 30%;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  img {
    width: 100%;
    margin: auto;
  }

  .error {
    color: red;
    margin-bottom: 20px;
    font-family: sans-serif;
  }

  .loading {
    color: #007bff;
    margin-bottom: 20px;
    font-family: sans-serif;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    color: #333;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .no-data {
    text-align: center;
    color: #888;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  button {
    padding: 10px 20px;
    border: none;
    background-color: #5500ff;
    color: white;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;
