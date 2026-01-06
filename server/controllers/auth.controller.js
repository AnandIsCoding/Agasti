import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import chalk from "chalk";
import { StatusCodes } from "http-status-codes";
import {
  FRONTEND_URL,
  NODE_ENV,
  SECRET_KEY,
} from "../configs/server.config.js";
import userRegistrationSuccessEmail from "../mail/templates/userRegistrationSuccessEmail.js";
import mailSender from "../utils/mailSender.utils.js";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.CLIENT_ID);

//  register user controller

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Required Field Missing" });
    }
    //  check if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User already exist, Please Login to your account",
      });
    }
    // 🔹 Password Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
        message:
          "Password must be at least 5 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
      });
    }
    //hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //   create a new user
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    //verify email url
    const verifyEmailUrl = `${FRONTEND_URL}/veridy-email?code=${newUser._id}`;

    //  send email
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Please verify email to register with Pluto Intero",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });
  } catch (error) {
    // Error handling, error response
    if (error.name === "ValidationError") {
      // Extract validation messages
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error(chalk.bgRed("Validation Error ---->>"), messages);
      return res.status(400).json({
        success: false,
        message: messages[0],
        error: messages[0],
      });
    }
    console.log(
      chalk.bgRedBright(
        "Error in registerUser in auth.controller.js ---->> ",
        error,
      ),
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in registerUser in auth.controller.js",
    });
  }
};

// Register with Google
export const registerWithGoogle = async (req, res) => {
  try {
    // access token from request body
    const { token } = req.body;
    const LoginTicket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = LoginTicket.getPayload();
    const { sub, name, email, picture } = payload;
    let user = await User.findOne({ email });
    let userExists = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name: name,
        profilePic: picture,
      });
    }
    // generate token
    const userToken = jwt.sign({ _id: user._id }, SECRET_KEY, {
      expiresIn: "15d",
    });
    // assign token in cookie
    res.cookie("token", userToken, {
  httpOnly: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    // send registration mail to new user
    try {
      if (!userExists) {
        await mailSender(
          user.email,
          "Welcome to Pluto Intero 🎉",
          userRegistrationSuccessEmail(user.name),
        );
      }
    } catch (error) {
      console.log(
        chalk.bgRedBright(
          "Error in sending success mail to user in registerWithGoogle",
        ),
      );
    }
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Login Successfull", user });
  } catch (error) {
    // Error handling, error response
    if (error.name === "ValidationError") {
      // Extract validation messages
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error(chalk.bgRed("Validation Error =>>>"), messages);
      return res.status(400).json({
        success: false,
        message: messages[0],
        error: messages[0],
      });
    }
    console.log(
      chalk.bgRedBright(
        "Error in registerWithGoogleController in auth.controller.js ---->> ",
        error,
      ),
    );
    return res.status(500).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in registerWithGoogleController in auth.controller.js",
    });
  }
};

// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("❌ Error in getProfile controller:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong while fetching profile",
    });
  }
};

// logout controller
export const userLogout = async (req, res) => {
  try {
     res.cookie("token", "", {
    httpOnly: true,
    sameSite: "none",
    expires: new Date(0),
  });
    return res
      .status(200)
      .json({ success: true, message: "User logout successfully" });
  } catch (error) {
    // Handle other errors
    console.log(
      chalk.bgRedBright(
        "Error in userLogout in auth.controller.js ---->> ",
        error,
      ),
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error !!",
      error: "Error in userLogout in auth.controller.js",
    });
  }
};

// Update logged-in user profile

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, dob, gender, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, dob, gender, profilePic },
      { new: true, runValidators: true, select: "-password -googleId" },
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Could not update profile",
    });
  }
};
