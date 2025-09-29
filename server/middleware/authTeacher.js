import jwt from "jsonwebtoken";

const authTeacher = (req, res, next) => {
  const token = req.cookies.teacherToken; // 👈 separate cookie for teacher
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no teacher token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = "teacher";
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid teacher token" });
  }
};

export default authTeacher;
