import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";
import UserController from "../controllers/UserController.js";

const BranchRouter = Router();

BranchRouter.post("/add", OwnerMiddleware, BranchesController.AddNewBranch);
BranchRouter.post("/workers/add", OwnerMiddleware, UserController.UserAddWorker);
BranchRouter.get("/all", OwnerMiddleware, BranchesController.GetMyBranches);

export default {
    path: "/api/branches",
    router: BranchRouter,
};