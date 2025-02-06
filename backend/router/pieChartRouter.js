import express from "express";
import pieChartController from "../controllers/pieChartController.js";

const pieChartRouter = express.Router();

pieChartRouter.get("/pie-chart", pieChartController);

export default pieChartRouter;
