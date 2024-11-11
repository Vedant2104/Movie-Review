const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const movieRouter = require("./routes/movie");
const {handleConnect} = require("./connection");
const {checkUser} = require("./middleware/auth");
require('dotenv').config();

const app = express();
// const PORT = 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(cors());
app.use(cors({
    origin:true,
    credentials:true
}));
 
handleConnect();

app.use("/api/user" , userRouter);
app.use("/api/profile",checkUser, profileRouter);
app.use("/api/movie", movieRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
})
console.log(process.env.PORT);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

