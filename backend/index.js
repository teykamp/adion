import "dotenv/config";
import express from "express";
import cors from "cors";
import "crypto";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";
import {router as UserRouter} from "../backend/routes/users";
// import {router as UserRouter} from "./routes/users";

const app = express();


// app.use(cors);
app.use(bodyParser.json()); // helps to read the incoming data
const SB = createClient(process.env.API_URL, process.env.API_KEY);

app.use("/api/user/", UserRouter)
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
