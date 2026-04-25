import "./config/env.js";
import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import { connectDB } from "./config/db.js";


const app = express();
await connectDB();
app.use("/api", uploadRoutes);

const PORT = process.env.PORT || 5000;


app.get('/',(req,res) =>{
    res.send("working...");
})

app.listen(PORT, () => {
  console.log(`Server running on-- http://localhost:${PORT}`);
});