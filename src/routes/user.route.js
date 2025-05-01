const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/topUp", userController.topUpUser);
router.get("/:email", userController.getUserByEmail);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;