import express from "express";
import userController from "../controllers/user.controller";

const router = express.Router();

router
  .route("/api/users")
  //.get(userCtrl.list)
  .post(userController.create);

export default router;
