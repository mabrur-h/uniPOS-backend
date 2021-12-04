import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";
import UserController from "../controllers/UserController.js";
import CategoriesController from "../controllers/CategoriesController.js";

const CategoriesRoute = Router();

CategoriesRoute.post('/:branch_id/add', OwnerMiddleware, CategoriesController.AddNewCategory)
CategoriesRoute.get('/:branch_id/add', AuthMiddleware, CategoriesController.GetCategories)

CategoriesRoute.get("/:category_id", AuthMiddleware, BranchesController);

export default {
    path: "/api/categories",
    router: CategoriesRoute,
};