const express = require("express");
const userController = require("../controller/userController");
const userRouter = express.Router();

userRouter.post("/signup", userController.signUp);
userRouter.post("/singin", userController.signIn);

module.exports = userRouter;