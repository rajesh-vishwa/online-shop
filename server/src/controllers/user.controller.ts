import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/create-user.dto";
import User, { validateUser } from "../models/user.model";
import errorHandler from "./../helpers/dbErrorHandler";

// register user
const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as CreateUserDto;
  // validate request payload of user
  const { error } = validateUser(req.body);
  if (error)
    return res.status(400).json({
      error: error.details[0].message,
    });

  // check if user already register
  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({
      error: "User already register with this email",
    });

  user = new User({ name, email, hashed_password: password });
  user.hashed_password = await user.hashPlainPassword(password);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error),
    });
  }
};

export default {
  createUser,
  getAllUsers,
};
