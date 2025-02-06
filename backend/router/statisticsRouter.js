import express from "express";
import statisticsController from "../controllers/statisticsController.js";

const statisticsRouter = express.Router();

statisticsRouter.get("/statistics", statisticsController);

export default statisticsRouter;
