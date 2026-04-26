import User from "../models/userModel.js";

//basic auth for now OAUth will be the final feature for this file

export async function register(req, res) {
  try {
    const { email, password } = req.body;


    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userId = "user_" + Date.now();

    const user = await User.create({
      userId,
      email,
      password,
    });

    res.json({
      message: "User registered",
      userId: user.userId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Register failed");
  }
}

//login------
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user.userId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
}