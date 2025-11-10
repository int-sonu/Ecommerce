import bcrypt from 'bcrypt';
import { User } from '../Model/usermodel.js';

import multer from "multer";
import path from "path";

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existuser = await User.findOne({ email });

    if (existuser) {
      return res.status(404).json({ message: 'This email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginuser = await User.findOne({ email, role: 'user' });

    if (!loginuser) {
      return res.status(400).json({ message: 'This user is not registered' });
    }

    const match = await bcrypt.compare(password, loginuser.password);
    if (!match) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    req.session.user = { _id: loginuser._id, role: 'user' };
    if (loginuser.status === 'Enable') {
      res.status(200).json({ message: 'User logged in successfully', user: loginuser });
    } else {
      res.status(403).json({ message: 'User is disabled' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminuser = await User.findOne({ email, role: 'admin' });

    if (!adminuser) {
      return res.status(400).json({ message: 'This admin is not registered' });
    }

    const match = await bcrypt.compare(password, adminuser.password);
    if (!match) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    req.session.Admin = { id: adminuser._id, role: 'admin' };

    res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allusers = await User.find({ role: 'user' });
    res.send(allusers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsersbyid = async (req, res) => {
  try {
    const usersid = req.params.id;
    const user = await User.findById(usersid);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const enabledisableuser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateuser = await User.findByIdAndUpdate(userId, { status: 'Disable' }, { new: true });
    res.send(updateuser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const enableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, { status: 'Enable' }, { new: true });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const userLogout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
      return res.status(200).json({ success: true, message: 'Logout successful' });
    });
  } else {
    res.status(200).json({ success: true, message: 'No active session' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkAuth = (req, res) => {
  if (req.session?.user) res.status(200).json({ user: req.session.user });
  else res.status(200).json({ user: null });
};

export const checkAuthenticator = (req, res) => {
  if (req.session?.Admin) res.status(200).json({ Admin: req.session.Admin });
  else res.status(200).json({ Admin: null });
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email role");
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;

    const updatedUser = await user.save();

    req.session.userId = updatedUser._id;

    res.json({
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
