import express from 'express'
import mongoose from "mongoose";
const app=express()

export const connectDB = async () => {
const url='mongodb://127.0.0.1:27017/nodeproject'

try {
  await mongoose.connect(url);
  console.log("Mongoose successfully connected");
} catch (err) {
  console.error("Mongoose connection failed:");
}
}