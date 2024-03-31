import "dotenv/config";
import express from "express";
import cors from "cors";
import "crypto";
import bodyParser from "body-parser";
import { getConnection } from "./utils/connection.js";
import { router as UserRouter } from "./routes/users.js";
import { router as RidePreferenceRouter } from "./routes/ridePreferences.js";
import { router as DriverRouter } from "./routes/driver.js";

const app = express();

// app.use(cors);
app.use(express.json()); // helps to read the incoming data
app.use("/api/user/", UserRouter);
app.use("/api/ridePrefs/", RidePreferenceRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello There!" });
});
app.listen(3000, () => {
  console.log(`server running on ${3000}`);
});

/**
 * @typedef {{
 * "first_name" : string,
 * last_name: string
 * gender:string,
 * pronouns: string,
 * email: string
 * }} user
 */
