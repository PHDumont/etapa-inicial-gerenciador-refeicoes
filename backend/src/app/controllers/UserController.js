import User from "../models/User.js";
import { getAuth } from "@clerk/express";

class UserController {
  findOrCreate = async (req, res) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email, name } = req.body;

    try {
      let user = await User.findOne({ userId: auth.userId });

      if (user) {
        return res.status(200).json(user);
      }

      user = await User.create({
        userId: auth.userId,
        email,
        name,
      });

      console.log(user);

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  getAll = async (req, res) => {
    const users = await User.find();
    return res.json(users);
  };
}

export default new UserController();
