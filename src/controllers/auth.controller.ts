import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, RequestHandler, Response, NextFunction } from "express";

import User from "../models/user.model";
import { generateToken } from "../lib/authentication";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();

    const token = generateToken(newUser._id as string);

    res.status(200).json({
      status: 200,
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Error registering user" });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Authentication Failed" });
    return;
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ status: 400, success: false, message: "User not found" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res
        .status(400)
        .json({ status: 400, success: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id as string);
    res
      .status(200)
      .json({ status: 200, success: true, token, user, message: "Logged in" });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Error logging in" });
  }
};
