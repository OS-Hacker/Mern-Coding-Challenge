import express from "express";
import combinedDataController from './../controllers/combinedDataController.js';

const combinedRouter = express.Router();

combinedRouter.get("/combine-data", combinedDataController);

export default combinedRouter;
