const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

 

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const grievanceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: {
    type: String,
    enum: ["Academic", "Hostel", "Transport", "Other"]
  },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending"
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
});

const Student = mongoose.model("Student", studentSchema);
const Grievance = mongoose.model("Grievance", grievanceSchema);
 

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Token" });
  }
};

 

 
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await Student.create({
      name,
      email,
      password: hashed
    });

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

 
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
});
 
 
app.post("/api/grievances", auth, async (req, res) => {
  const data = await Grievance.create({
    ...req.body,
    student: req.user.id
  });
  res.json(data);
});

 
app.get("/api/grievances", auth, async (req, res) => {
  const data = await Grievance.find({ student: req.user.id });
  res.json(data);
});

app.get("/api/grievances/search", auth, async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Title query is required" });
    }

    const data = await Grievance.find({
      title: { $regex: title, $options: "i" }
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});
 
app.get("/api/grievances/:id", auth, async (req, res) => {
  const data = await Grievance.findById(req.params.id);
  res.json(data);
});

 
app.put("/api/grievances/:id", auth, async (req, res) => {
  const data = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
});

 
app.delete("/api/grievances/:id", auth, async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});
 


 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});