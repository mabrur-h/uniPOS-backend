import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";
import UserController from "../controllers/UserController.js";

const ProductsRoute = Router();

ProductsRoute.get("/:branch_id", AuthMiddleware, BranchesController.GetMyWorkers);

export default {
    path: "/api/products",
    router: ProductsRoute,
};