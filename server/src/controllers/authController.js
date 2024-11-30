import { error } from "console";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: false, message: "Email and Password are required" });
      }

      // Check if it is super admin login
      if (
        email === process.env.adminEmail &&
        password === process.env.adminPassword
      ) {
        const adminToken = jwt.sign(
          { email, role: "super_admin" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" } // Token expiration
        );
        // Send token in a cookie
        res.cookie("token", adminToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          status: true,
          message: "Logged in as super admin successfully",
          role: "super_admin",
        });
      }

      // Find the user in the database
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      // Compare password with the stored hash
      const isValidUser = await bcrypt.compare(password, user.password);
      if (!isValidUser) {
        return res
          .status(401)
          .json({ status: false, message: "Incorrect password" });
      }
      // Assign role based on user type
      const role = user.isAdmin ? "admin" : "user";

      // Generate JWT for the user
      const userToken = jwt.sign(
        { id: user._id, email: user.email, role }, // Token payload
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expiration
      );

      // Send token in a cookie
      res.cookie("token", userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Return the response with role and user data
      res.status(200).json({
        status: true,
        message: `${user.name} is logged in successfully as ${role}`,
        data: user,
        role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        message: err.message || "Internal server error",
      });
    }
  },

  signup: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          status: false,
          message:
            "All fields (firstName, lastName, email, password) are required",
        });
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Invalid email format",
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          status: false,
          message: "Email already registered",
        });
      }

      // Validate password strength (minimum 6 characters)
      if (password.length < 6) {
        return res.status(400).json({
          status: false,
          message: "Password must be at least 6 characters long",
        });
      }

      // Create new user
      const newUser = new User({
        name: `${firstName} ${lastName}`,
        email,
        password: password,
        isAdmin: false, // By default, new users are not admins
      });

      // Save user to database
      const savedUser = await newUser.save();

      // Generate JWT token
      const userToken = jwt.sign(
        {
          id: savedUser._id,
          email: savedUser.email,
          role: "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set token in cookie
      res.cookie("token", userToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 hour
      });

      // Return success response
      res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: "user",
        },
      });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({
        status: false,
        message: err.message || "Internal server error",
      });
    }
  },

  logout: async (req, res) => {
    try {
      // Clear the token cookie
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0), // Set expiration to past date to immediately expire
      });

      return res.status(200).json({
        status: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message || "Error during logout",
      });
    }
  },
};

export default authController;
