// auth/controller.js
import { successResponse, errorResponse } from "../common/response.js";
import { loginService, registerOwnerService } from "./service.js";

export const registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerOwnerService({ name, email, password });
    return res.status(201).json(successResponse(data, "OWNER_REGISTERED", 201));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(errorResponse(err.message || "REGISTER_FAILED", 400));
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginService({ email, password });
    return res.status(200).json(successResponse(data, "LOGIN_SUCCESS", 200));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(errorResponse(err.message || "LOGIN_FAILED", 400));
  }
};
