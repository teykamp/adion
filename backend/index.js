import "dotenv/config";
import express from "express";
import cors from "cors";
import "crypto";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();

//utils
const error_flags = {
  1: "First name cannot be empty or contain numbers",
  2: "Last name cannot be empty or contain numbers",
  3: "Invalid email",
  4: "Email already registered. Login instead",
};

function validate_UserJson(new_user) {
  /**
   * @type{Array<number>}
   */
  const errors = [];

  const characters_only = /^[A-Za-z]+$/;
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkUserExists = async (email) => {
    const user_email = await (await SB.from("User").select("email")).data;
    return user_email.filter((eml) => (eml = email)) == 0;
  };

  if (!characters_only.test(new_user.first_name)) {
    errors.push(1);
  }
  if (!characters_only.test(new_user.last_name)) {
    errors.push(2);
  }
  if (!validateEmail(new_user.email)) {
    errors.push(3);
  }
  if (!checkUserExists(new_user.email)) {
    errors.push(4);
  }

  return errors;
}

// app.use(cors);
app.use(bodyParser.json()); // helps to read the incoming data
const SB = createClient(process.env.API_URL, process.env.API_KEY);

// app.put("/riders/create", (re) =>)
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing" });
});

// get all users
app.get("/users", async (req, res) => {
  const { data, error } = await SB.from("User").select("*").limit(5);
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: data });
});

// get specific user
app.get("/users/:uuid", async (req, res) => {
  const { data, error } = await SB.from("User")
    .select("*")
    .eq("User.uuid", req.params.uuid);

  if (error) {
    res.status(400).json({ error: error });
    return;
  }

  res.status(200).json({ data: data });
});

// create user
app.post("/users/create", async (req, res) => {
  /**
   * @type{user}
   */
  const new_user = req.body;
  new_user.id = crypto.randomUUID();

  const errors = validate_UserJson(new_user);
  if (errors.length != 0) {
    let error_string = "";
    errors.forEach((err) => {
      error_string = error_string + error_flags[err] + "\n";
    });
    res.status(400).json({ error: error_string });
  }

  const { error } = await SB.from("User").insert(new_user);
  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(201).json({ data: `user ${new_user.id} created` });
});

// delete user
app.delete("/users/:uuid", async (req, res) => {
  const user_uuid = req.params.uuid;
  const { error } = await SB.from("User").delete().eq("id", user_uuid);

  if (error) {
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: `user ${user_uuid} deleted` });
});

// update user

app.put("/users/:uuid", async (req, res) => {
  /**
   * @type{user}
   */
  const new_data = req.body;

  // valdiate user fields
  const errors = validate_UserJson(new_data);
  if (errors.length != 0) {
    let error_string = "";
    errors.forEach((err) => {
      error_string = error_string + error_flags[err] + "\n";
    });
    res.status(400).json({ error: error_string });
  }

  const { data, error } = await SB.from("User")
    .update(new_data)
    .eq("id", req.params.uuid).select();

  console.log(data);
  if(error){
    res.status(400).json({ error: error });
    return;
  }
  res.status(200).json({ data: JSON.stringify(data[0]) });
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
