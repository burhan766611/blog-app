import jwt from "jsonwebtoken";

const isLogin = (req, res, next) => {
  try {
    const token = req.cookies?.token; // safer check
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Forbidden: Invalid or expired token" });
      }
      req.user = decoded; // attach user info to request
      next();
    });
  } catch (err) {
    console.error("isLogin error:", err);
    res.status(500).json({ success: false, message: "Internal server error in isLogin middleware" });
  }
};

export default isLogin;
