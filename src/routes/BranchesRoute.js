import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";

const BranchRouter = Router();

BranchRouter.post("/add", BranchesController.AddNewBranch);

export default {
    path: "/api/branches",
    router: BranchRouter,
};