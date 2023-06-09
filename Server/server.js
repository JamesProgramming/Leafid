import mongoose from "mongoose";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
});

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
