import { getAuth } from "@clerk/express";
import User from "../models/User.js";

class BasicController {
  getCurrentUser = async (req, res) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return null;
    }

    const user = await User.findOne({ userId: auth.userId }).lean();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return null;
    }

    return user;
  };
}

export default BasicController;
