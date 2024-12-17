const bcrypt = require("bcrypt");
const mongooseUser = require("../models/user");

async function createUser(userParams) {
  const { username, email, password, role } = userParams;
  try {
    const existingUser = await mongooseUser.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new mongooseUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return newUser;
  } catch (e) {
    console.error("Error creating user:", e.message);
    throw e;
  }
}

async function getUser(userParams) {
  const { id } = userParams;
  try {
    const user = await mongooseUser.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (e) {
    console.error("Error fetching user:", e.message);
    throw e;
  }
}

async function getUsers() {
  try {
    const newUser = await mongooseUser.find();
    return newUser;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function updateUser(userParams) {
  const { id, email, password, username, role } = userParams;

  try {
    const user = await mongooseUser.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (username) user.username = username;
    if (role) user.role = role;

    const updatedUser = await user.save();
    console.log("Updated User:", updatedUser);
    return updatedUser;
  } catch (e) {
    console.error("Error updating user:", e.message);
    throw e;
  }
}

async function deleteUser(userParams) {
  const { id } = userParams;
  try {
    const userDelete = await mongooseUser.findByIdAndDelete(id);
    if (!userDelete) {
      throw new Error("User not found");
    }
    return userDelete;
  } catch (e) {
    console.error("Error deleting user:", e.message);
    throw e;
  }
}

const getProfile = async (req) => {
  try {
    if (!req.user || !req.user.email) {
      throw new Error("User not authenticated");
    }

    const user = await mongooseUser.findOne({ email: req.user.email })

    if (!user) {
      throw new Error("User not found");
    }

    return user; // Return the user object
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error; // Propagate the error
  }
};



module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getProfile,
};
