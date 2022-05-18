const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes.js");
const tourRouter = require("./routes/tourRoutes.js");
const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 2000;
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 102400 }));
app.use("/users", userRouter);
app.use("/tour", tourRouter);
app.get("/", (req, res) => res.send("Hello Welcome to Tour API MERN "));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(PORT, () => {
  console.log(`Listening to EXPRESS http://localhost:${PORT}`);
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("MONGO-DB Connection Successfull");
    })
    .catch((err) => console.log(err.message + "server not able to connect"));
});
