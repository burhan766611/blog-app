import jwt from "jsonwebtoken";

const isLogin = (req, res, next) => {
  try {
    const userToken = req.cookies.token;
    if (!userToken) {
      return res.status(401).json({ success: false ,message: "Unauthorized: User" });
    }

    jwt.verify(userToken, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal server error in isLogin middleware" });
  }
};

export default isLogin;
