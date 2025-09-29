import jwt from "jsonwebtoken";

const authLearner = (req, res, next) => {
  const token = req.cookies.learnerToken; // 👈 separate cookie for learner
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no learner token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = "learner";
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid learner token" });
  }
};

export default authLearner;
