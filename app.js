import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import router from "./routes/route.js";
import { connectDB } from './db/db.js';
import route from "./routes/userroute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB()

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/nodeproject" }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use('/uploads', express.static('uploads'));

app.use(router)

app.use(route)

app.get("/", (req, res) => {
  res.send("Hello, World!Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
