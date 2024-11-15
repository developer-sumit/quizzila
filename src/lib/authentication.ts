import jwt from "jsonwebtoken";

export function generateToken(_id: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { _id },
    process.env.JWT_SECRET
    // {expiresIn: "7d"}
  ); // Long-lived refresh token
  return token;
}
