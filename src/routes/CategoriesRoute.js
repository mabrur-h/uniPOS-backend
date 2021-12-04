import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import BranchesController from "../controllers/BranchesController.js";
import UserController from "../controllers/UserController.js";
import CategoriesController from "../controllers/CategoriesController.js";

const CategoriesRoute = Router();

CategoriesRoute.post('/branch/add', OwnerMiddleware, CategoriesController.AddNewCategory)
CategoriesRoute.get('/branch/:branch_id', AuthMiddleware, CategoriesController.GetCategories)

CategoriesRoute.get("/products/:category_id", AuthMiddleware, CategoriesController.GetProductsByCategory);

export default {
    path: "/api/categories",
    router: CategoriesRoute,
};