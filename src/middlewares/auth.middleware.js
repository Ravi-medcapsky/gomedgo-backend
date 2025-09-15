import jwt from "jsonwebtoken";
import * as userModel from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use the correct method to find user by identifier
    req.user = await userModel.findByIdentifier(decoded.identifier);

    if (!req.user) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token verification failed" });
  }
};

