import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";
import UserController from "../controllers/UserController.js";

const CategoriesRoute = Router();

CategoriesRoute.get("/:branch_id/workers", OwnerMiddleware, BranchesController.GetMyWorkers);

export default {
    path: "/api/categories",
    router: CategoriesRoute,
};