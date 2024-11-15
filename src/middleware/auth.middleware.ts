import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const authenticateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ status: 401, message: "Unauthorized access" }); // Unauthorized
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ status: 500, message: "Internal server error" }); // Internal server error
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ status: 403, message: "Forbidden access" }); // Forbidden
        return;
      }

      const decodedPayload = decoded as jwt.JwtPayload;
      const userId = decodedPayload._id;

      if (!userId) {
        res.status(403).json({ status: 403, message: "Forbidden access" }); // Forbidden
        return;
      }

      req.userId = userId; // Attach user information to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } else {
    res.status(401).json({ status: 401, message: "Unauthorized access" }); // Unauthorized
    return;
  }
};
