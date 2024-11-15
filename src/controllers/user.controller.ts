import { NextFunction, Request, RequestHandler, Response } from "express";
import User from "../models/user.model";

export const getUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res
        .status(404)
        .json({ status: 404, success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ status: 200, success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, success: false, message: "Error fetching user" });
  }
};
