// backend/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"
import * as authService from "./services/auth.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const registerOwner = async (req, res, next) => {
  try {
    const owner = await authService.registerOwner(req.body);
    res.status(201).json({ success: true, data: owner });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
