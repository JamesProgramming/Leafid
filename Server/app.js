import express from "express";
import compression from "compression";
import modelRouter from "./routes/modelRouter.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import hpp from "hpp";

const app = express();

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true, limit: "300kb" }));
app.use(cookieParser());

// Allow data compression.
app.use(compression());

if (process.env.production == "development") {
}

app.use(
  cors({
    origin: ["http://192.168.0.128"],
    credentials: true,
    methods: ["POST"],
  })
);

app.use(
  rateLimit({
    max: 75,
    windowMs: 60 * 60 * 1000,
    message: "To many request in an hour.",
  })
);
console.log("request");

app.use(hpp());
// Route handlers.
app.use("/api/v1/user", userRouter);
app.use("/api/v1/model", modelRouter);

// If route is not found.
app.all("*", (req, res) => {
  res
    .status("404")
    .json({ status: "failure", data: { message: "Route not found." } });
});

export default app;
