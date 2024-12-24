import { verifyJWT } from "../utils/jwt.js";
import { getUserByEmail } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const result = verifyJWT(authorization);
    if (result?.email) {
      const user = await getUserByEmail(result.email);
      if (user?._id) {
        user.password = undefined;
        req.userinfo = user;

        return next();
      } 
    }

    res.status(401).json({ status: "error", message: "Unauthorized" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Some error occured", details: error.message });
  }
};
