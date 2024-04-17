import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinary } from "../helpers/cloudinary.config.js";
import bcrypt from "bcrypt"

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken" });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // handle image upload
    if (image) {
      try {
        const imagePath = await cloudinary.uploader.upload(image.path);
        user.image = imagePath.secure_url;
        user.imagePublicId = imagePath.public_id;
      } catch (err) {
        console.log(err);
        return res.json({success: false, message: "Error uploading image", err})
      }
    }

    await user.save();

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "User logged in successfully",
      user: {
        name: user.name,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {
const { email } = req.body

if(!email){
  return res.status(400).json({message: "Email is required"});
}
// Find user by email
const user = await User.findOne({email});
if (!user) {
  return res.status(404).json({error: "User not found"});
}

// OTP and send to user


//  Generate password reset token
const resetToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"1h"});

  // send reset token to user's email address
  const domain = "www.blard.com";
  const resetLink = `${domain}/reset/${resetToken}`

  // send response including the reseToken
  return res.json({ message: "Password reset token generated successfully", resetToken });


  }catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "failed to reset token" });
  }
}

// resetPassword function
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const resetToken  = req.headers.authorization

    if(!newPassword){
      return res.status(400).json({success: false, message: "New password is required"});
    }
    if(!resetToken || !resetToken.startsWith("Bearer")){
      return res.status(401).json({success: false, message: "Invalid token"});
    }

    // get token without the "Bearer"
    const token = resetToken.split(" ")[1]

    // verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if(!decodedToken){
      return res.status(403).json({success: false, message: "Invalid token"});
    }

    
    const userId = decodedToken.userId;

    // find user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: "Invalid User"});
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    // save user (including the new password)
    await user.save();

    res.json({sucess: true, message: "password reset successfully"});

  }catch(err) {
    console.log(err.message);
    return res.status(500).json({sucess: false, message: "Password reset failed", error: err.message});

  }
}