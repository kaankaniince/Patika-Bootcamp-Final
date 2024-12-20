const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongooseUser = require("../models/user");

async function login(userParams) {
  const { email, password } = userParams;
  try {
    const user = await mongooseUser.findOne({ email: email });
    console.log("Found user:", user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: "Invalid email or password" };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    console.log("Generated token:", token);
    console.log("Backend response being sent:", {
      success: true,
      token: token,
      message: "success",
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        userId: user._id,
      },
    });
    return {
      success: true,
      token: token,
      message: "success",
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
        userId: user._id,
      },
    };
  } catch (e) {
    console.log("Login error:", e);
    throw e;
  }
}

module.exports = { login };
