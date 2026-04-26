import "./config/env.js";
import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();
await connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/page", pageRoutes);

const PORT = process.env.PORT || 5000;


app.get('/',(req,res) =>{
    res.send("working...");
})

app.listen(PORT, () => {
  console.log(`Server running on-- http://localhost:${PORT}`);
});