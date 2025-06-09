import express from "express";
import { updateProductVector } from "../controllers/updateController.js";

const updateRouter = express.Router();
updateRouter.post("/update-product", updateProductVector);

export default updateRouter;