import express from "express";
import barCharController from "../controllers/barChartController.js";

const barChartRouter = express.Router();

barChartRouter.get("/bar-Chart", barCharController);

export default barChartRouter;
