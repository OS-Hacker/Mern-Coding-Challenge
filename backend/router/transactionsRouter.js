import express from "express";
import transactionController from "../controllers/transactionController.js";

const transactionsRouter = express.Router();

transactionsRouter.get("/transactions", transactionController);

export default transactionsRouter;
