import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
});

// Load configuration file into process environment.
dotenv.config({ path: "./config.env" });

// Database conection string.
const database = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// Connect to database.
mongoose
  .connect(database, {
    autoIndex: true,
  })
  .then(() => console.log("DB connected!!"));

// Post to listen on.
const port = process.env.PORT || 3001;

// Start server.
const server = app.listen(port, () => {
  console.log(`Running !! Port: ${port}`);
});
