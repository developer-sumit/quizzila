import bcrypt from "bcrypt";
import mongoose, { Document } from "mongoose";
import { UserProps } from "../types/user.type";

const userSchema = new mongoose.Schema<UserProps & Document>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  // Hash the password
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
