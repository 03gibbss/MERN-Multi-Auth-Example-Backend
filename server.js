require("dotenv").config();
const colors = require("colors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

require("./strategies/jwtStrategy");
require("./strategies/localStrategy");
require("./authenticate");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const WHITELIST = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || WHITELIST.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/users", require("./routes/userRoute"));

app.get("/", function (req, res) {
  res.send({ status: "success" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
