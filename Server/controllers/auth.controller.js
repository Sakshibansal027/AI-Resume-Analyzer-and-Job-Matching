import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const sendVerificationEmail = async (user) => {
  const verifyUrl = `${CLIENT_URL}/verify-email/${user.verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email — AI Resume Analyzer",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome, ${user.name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Verify Email</a>
        <p>Or copy this link into your browser:</p>
        <p>${verifyUrl}</p>
        <p style="color:#888;font-size:12px;">This link expires in 24 hours. If it expires, you'll need to register again.</p>
      </div>
    `,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Already a real, verified account? Block it.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Remove any stale pending signup for this email so we can start fresh
    // (handles cases where someone registered before but never verified)
    await PendingUser.deleteOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const pendingUser = await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      role: role || "candidate",
      verificationToken,
      expiresAt,
    });

    try {
      await sendVerificationEmail(pendingUser);
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr.message);
      // Roll back — no point keeping a pending signup the user can't verify
      await PendingUser.deleteOne({ _id: pendingUser._id });
      return res.status(500).json({
        message: "Could not send verification email. Please try registering again.",
      });
    }

    res.status(201).json({
      message: "Almost done! Please check your email to verify your account before logging in.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Give a helpful hint if there's an unverified signup waiting
      const pending = await PendingUser.findOne({ email });
      if (pending) {
        return res.status(403).json({
          message: "Please verify your email before logging in.",
          notVerified: true,
        });
      }
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const pendingUser = await PendingUser.findOne({
      verificationToken: token,
      expiresAt: { $gt: new Date() },
    });

    if (!pendingUser) {
      return res.status(400).json({
        message: "Verification link is invalid or has expired. Please register again.",
      });
    }

    // Promote the pending signup into a real, permanent User
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password, // already hashed
      role: pendingUser.role,
      isVerified: true,
    });

    await PendingUser.deleteOne({ _id: pendingUser._id });

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    // Handle the rare race condition where the user got verified twice concurrently
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This account has already been verified. Please log in.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      const alreadyVerified = await User.findOne({ email });
      if (alreadyVerified) {
        return res.status(400).json({ message: "This account is already verified. Please log in." });
      }
      return res.status(404).json({
        message: "No pending registration found for this email. Please register again.",
      });
    }

    pendingUser.verificationToken = crypto.randomBytes(32).toString("hex");
    pendingUser.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await pendingUser.save();

    await sendVerificationEmail(pendingUser);

    res.status(200).json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If an account exists with this email, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password — AI Resume Analyzer",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password. Click below to set a new one.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Reset Password</a>
          <p>Or copy this link into your browser:</p>
          <p>${resetUrl}</p>
          <p style="color:#888;font-size:12px;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset link is invalid or has expired.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};