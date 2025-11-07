import express from 'express'
import mongoose from "mongoose";
const app = express()

export const connectDB = async () => {
  const url = process.env.atlas_URL
  // console.log(url)
  try {
    await mongoose.connect(url);
    console.log("Mongoose successfully connected");
  } catch (err) {
    console.error("Mongoose connection failed:");
  }
}