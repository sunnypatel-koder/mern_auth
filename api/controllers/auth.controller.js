import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
// import { erorrHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Step 1: Find the user by email
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    // Step 2: Compare passwords
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    // Step 3: Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Step 4: Exclude password from user data
    const { password: hashedPassword, ...rest } = validUser._doc;

    // Step 5: Set the token as a cookie and send user data in the response

    const expiryDate = new Date(Date.now() + 3600000);

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
