require("dotenv").config();

const express = require("express");
const logger = require("morgan");
// const ejsMate = require("ejs-mate");
const cors = require("cors");
const app = express();

const dbConfig = require("./config/dbConfig");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

app.use(logger("dev"));

app.use(express.json());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const profileRouter = require("./routes/profileRoutes");
const savedRouter = require("./routes/savedRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/profile", profileRouter);
app.use("/property", propertyRouter);
app.use("/saved", savedRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

// app.engine("ejs", ejsMate);

// app.set("view engine", "ejs");

dbConfig();
app.listen(process.env.PORT, () => {
  console.log(`Listening to the server on port ${process.env.PORT}!!!`);
});
