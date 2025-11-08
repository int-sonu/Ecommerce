import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import router from "./routes/route.js";
import { connectDB } from './db/db.js';
import route from "./routes/userroute.js";
import cors from 'cors'
dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.Cors_uri,
  credentials: true

}))
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB()

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: "mongodb+srv://sonu_sebastian:node%401416@node-project.p7m3col.mongodb.net/?appName=Node-Project" }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use('/api/uploads', express.static('uploads'));


app.use('/api/user', route)
app.use(router)

app.get("/", (req, res) => {
  res.send("Hello, World!Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
