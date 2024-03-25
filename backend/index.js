import "dotenv/config";
import express from "express";
import cors from "cors";
import "crypto";
import { createClient } from "@supabase/supabase-js";

const app = express();

// app.use(cors);

const SB = createClient(process.env.API_URL, process.env.API_KEY);

// app.put("/riders/create", (re) =>)
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing" });
});
app.get("/users", async (req, res) => {
  const { data, error } = await SB.from("User").select("*").limit(5);
  console.log(data);
  console.log(error);
  res.status(200).json({ data: data });
});
app.get("/users/:uuid", (req, res) => {});
app.post("/users/create", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ data: "testing" });
  //   new_user = req.body();
  //   new_user.id = crypto.randomUUID();
  //   const { error } = await SB.from("User").insert();
});
app.delete("/users/uuid", (req, res) => {});

app.listen(3000, () => {
  console.log(`server running on ${3000}`);
});
