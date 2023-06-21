import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router
  .route("/api/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

export default router;
