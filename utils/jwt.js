import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_TOKEN || "SGVsbG8sIFdvcmxkIQ==";

export const signJWT = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    throw error.message;
  }
};

export const verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw error.message;
  }
};
