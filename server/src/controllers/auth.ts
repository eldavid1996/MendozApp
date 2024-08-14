import { Request, Response } from "express";
import { loginUserMongo, registerUserMongo } from "../services";
import { generateToken } from "../utils";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const response = await registerUserMongo(username, email, password);
    if (response !== "Success") {
      return res.status(400).json({ error: response });
    }
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await loginUserMongo(email, password);
    if (response !== "Success") {
      return res.status(400).json({ error: response });
    }
    const token = await generateToken(email);
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
