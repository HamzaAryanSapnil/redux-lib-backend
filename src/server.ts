import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import routes from "./modules/routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Mongoose Level 2 Problem Solving",
  });
});

app.listen(config.port, () => {
  console.log(
    `🎉🎆🧨 server is running on port http://localhost:${config.port}`
  );
});

async function server() {
  try {
    await mongoose.connect(config.db_url!);

    console.log(`🍃🍃🍃 connected to database`);
  } catch (error) {
    console.error({
      message: `Something went wrong in the server ${server} `,
      error,
    });
  }
}
server();
