const express = require("express");
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/:id", userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/:id", authMiddleware, userController.getUser);
router.get("/", userController.getUsers);
router.post('/order',userController.createOrder)

module.exports = router;
