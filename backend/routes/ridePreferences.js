import express from "express";
import { getConnection } from "../utils/connection.js";

export const router = express.Router();

/**
 * create user's ride preferences
 */
router.post("/:uuid", async (req, res) => {
  const SB = getConnection();
  const user_prefs = req.body;
  const user_uuid = req.params.uuid;
  console.log({ user_id: user_uuid, ...user_prefs });
  const error = SB.from("RidePreferences").insert([
    {
      user_id: user_uuid,
      ...user_prefs,
    },
  ]);
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: { user_id: user_uuid, ...user_prefs } });
});

router.get("/:uuid", async (req, res) => {
  const SB = getConnection();
  const { data, error } = await SB.from("RidePreferences")
    .select("*")
    .eq("user_id", req.params.uuid);
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: data });
});

router.put("/:uuid", async (req, res) => {
  const SB = getConnection();
  const new_pref = req.body;
  const { data, error } = SB.from("RidePreferences")
    .update(new_pref)
    .eq("user_id", req.params.uuid)
    .select();
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: data });
});

router.delete("/:uuid", async (req, res) => {
  const SB = getConnection();
  const error = SB.from("RidePreferences")
    .delete()
    .eq("user_id", req.params.uuid);
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: `user id with ${req.params.uuid} deleted` });
});
