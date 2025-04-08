// TODO: Al final BORRAR este archivo

import jwt from "jsonwebtoken";

export const getToken = (req, res) => {
  const token = jwt.sign(
    { userId: 1, username: "johndoe95" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(200).json({ message: "Login successful", token, username: "johndoe95" });
};
