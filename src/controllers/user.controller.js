import user from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appConfig } from "../configs/appConfig.js";
const { ACCESS_TOKEN_SECRET } = appConfig;
const salt = bcrypt.genSaltSync(10);
export const createUser = async (request, response) => {
  const { username, password } = request.body;
  try {
    const checkUsername = await user.findOne({ username });
    if (checkUsername) {
      return response
        .status(200)
        .json({ message: "Username already exists", type: "fail" });
    }
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = await user.create({
      ...request.body,
      password: hashPassword,
    });
    return response.status(200).json({
      message: "User created successfully",
      type: "success",
      data: { username: newUser.username },
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, type: "fail" });
  }
};

// find user by id.
export const findUsers = async (request, response) => {
  const { id } = request.params;
  user
    .findOne({ _id: id })
    .populate()
    .then((data) =>
      response.json({
        data,
        type: "success",
        message: "User fetched successfully",
      })
    )
    .catch((error) =>
      response.status(400).json({ message: error.message, type: "fail" })
    );
};

// find user by userRole.
export const findUsersByRole = async (request, response) => {
  const { userRole } = request.query;
  user
    .findAll({ userRole })
    .populate()
    .then((data) =>
      response.json({
        data,
        type: "success",
        message: "User fetched successfully",
      })
    )
    .catch((error) =>
      response.status(400).json({ message: error.message, type: "fail" })
    );
};

// get all users.
export const getAllUsers = async (request, response) => {
  await user
    .find()
    .then((data) =>
      response.json({
        data,
        type: "success",
        message: "Users fetched successfully",
      })
    )
    .catch((error) =>
      response.status(400).json({ message: error.message, type: "fail" })
    );
};

//login for user
export const userLogin = async (request, response) => {
  const { username, password } = request.body;
  try {
    if (!username) {
      return response.status(400).json({
        isLoggedin: false,
        username: "Fill correct details",
        type: "fail",
      });
    }
    if (!password) {
      return response.status(400).json({
        isLoggedin: false,
        password: "Fill correct details",
        type: "fail",
      });
    }
    const userDetails = await user.findOne({ username });
    if (!userDetails) {
      return response.status(400).json({
        isLoggedin: false,
        username: "Invalid username",
        type: "fail",
      });
    }
    if (!(await bcrypt.compare(password, userDetails?.password))) {
      return response.status(400).json({
        isLoggedin: false,
        password: "Invalid Password",
        type: "fail",
      });
    }
    const accessToken = jwt.sign({ user: userDetails }, ACCESS_TOKEN_SECRET);
    return response.status(200).json({
      message: "Logged in Successfully",
      isLoggedin: true,
      token: accessToken,
      username: userDetails?.username,
      id: userDetails?.id,
      type: "success",
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: error.message, isLoggedin: false, type: "fail" });
  }
};

//delete user account.
export const deleteUser = (request, response) => {
  const { id } = request.query;
  user
    .deleteOne({ _id: id })
    .then(() => response.json("User Successfully deleted"))
    .catch((error) =>
      response.status(400).json({ message: error.message, type: "fail" })
    );
};
