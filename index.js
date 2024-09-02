import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import donationRouter from "./src/routes/donation.router.js";
import userRouter from "./src/routes/user.router.js";
import authRouter from "./src/routes/auth.router.js";
import { appConfig } from "./src/configs/appConfig.js";
const { PORT, MONGO_URL } = appConfig;
const app = express();
app.use(cors({ origin: "*", Credentials: true }));
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to DB successfuly");
    app.listen(PORT, (error) => {
      if (!error) {
        return console.log("Server is running at PORT " + PORT);
      }
      console.log("Error occered while starting the server " + error);
    });
  })
  .catch((error) => {
    console.log("error connectiong to DB ", error);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (request, response) => {
  response.send("Welcome");
});
app.use("/donation", donationRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
export default app;
