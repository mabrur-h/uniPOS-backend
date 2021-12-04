import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import OwnerMiddleware from "../middlewares/OwnerMiddleware.js";

const UserRouter = Router();

UserRouter.post("/signup", UserController.UserCreateAccount);
UserRouter.post("/login", UserController.UserLoginAccount);
UserRouter.post("/validate", UserController.UserValidateCode);
UserRouter.post("/add-worker", OwnerMiddleware, UserController.UserAddWorker);

UserRouter.get("/profile", AuthMiddleware, UserController.UserGetMyAccount);

export default {
    path: "/api/users",
    router: UserRouter,
};