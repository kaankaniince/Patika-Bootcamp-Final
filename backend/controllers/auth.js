const userService = require("../services/user");
const authService = require("../services/auth");

const authController = {
  login: async (req, res) => {
    try {
      const result = await authService.login(req.body);

      if (result.token) {
        res.status(200).json({
          success: true,
          token: result.token,
          user: result.user,
          message: result.message,
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Login controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  register: async (req, res) => {
    try {
      const response = await userService.createUser(req.body);
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
    }
  },
};
module.exports = authController;
