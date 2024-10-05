const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const {handleConnect} = require("./connection");
const {checkUser} = require("./middleware/auth");
//Hello
const app = express();
const PORT = 8002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:true,
    credentials:true
}));
 

handleConnect();

app.use("/api/user" , userRouter);
app.use("/api/profile",checkUser, profileRouter);

app.use("/", (req, res) => {
    res.send("Hello World");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

