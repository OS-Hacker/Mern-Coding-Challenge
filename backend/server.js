import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import connectdb from "./db/connectdb.js";
import { TransactionModel } from "./model/transactionModel.js";
import transactionsRouter from "./router/transactionsRouter.js";
import statisticsRouter from "./router/statisticsRouter.js";
import barChartRouter from "./router/barChartRouter.js";
import pieChartRouter from "./router/pieChartRouter.js";
import combinedRouter from "./router/combinedRouter.js";

dotenv.config();

const server = express();

// Middleware
server.use(cors());
server.use(express.json());

// Connect to database
connectdb();

server.get("/init", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Check if response data is valid
    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      return res.status(500).json({
        message: "Failed to fetch data. Third-party API may be down.",
      });
    }

    // Transform data to ensure dateOfSale is properly formatted
    const sanitizedData = response.data.map((item) => {
      let validDate = new Date(item.dateOfSale);
      return {
        ...item,
        dateOfSale: validDate,
      };
    });

    await TransactionModel.deleteMany({});

    await TransactionModel.insertMany(sanitizedData);

    res.status(200).json({ message: "Data initialized successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// Routers
server.use(transactionsRouter);
server.use(statisticsRouter);
server.use(barChartRouter);
server.use(pieChartRouter);
server.use(combinedRouter);

// Create server
server.listen(process.env.PORT || 8080, () =>
  console.log(`Server is running on port ${process.env.PORT || 8080}`)
);
