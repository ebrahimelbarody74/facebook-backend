const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
const cors = require("cors");

dotenv.config();

mongoose.connect(
  "mongodb://ebrahim:123@ac-0k5qbva-shard-00-00.ionptfc.mongodb.net:27017,ac-0k5qbva-shard-00-01.ionptfc.mongodb.net:27017,ac-0k5qbva-shard-00-02.ionptfc.mongodb.net:27017/chat?ssl=true&replicaSet=atlas-pxmwai-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use(express.static(__dirname + "/public/images"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(8800 || process.env.PORT, () => {
  console.log("Backend server is running!");
});
