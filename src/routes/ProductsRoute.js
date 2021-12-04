import { Router } from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";
import ProductsController from "../controllers/ProductsController.js";

const ProductsRoute = Router();

ProductsRoute.post('/:category_id/add', OwnerMiddleware, ProductsController.AddNewProduct)

ProductsRoute.get('/:product_id', AuthMiddleware, ProductsController.GetProductById)
ProductsRoute.get('/branch/:branch_id', AuthMiddleware, ProductsController.GetProductsByBranch)

export default {
    path: "/api/products",
    router: ProductsRoute,
};