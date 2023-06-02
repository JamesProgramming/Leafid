import express from "express";
import compression from "compression";
import modelRouter from "./routes/modelRouter.js";
import userRouter from "./routes/userRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true, limit: "300kb" }));
app.use(cookieParser());

// Allow data compression.
app.use(compression());

app.use(
  cors({
    origin: [
      "http://192.168.0.147:3001",
      "http://localhost:3000",
      "http://192.168.0.147:3000",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["POST"],
  })
);

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
