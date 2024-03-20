require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const SB = createClient(process.env.API_URL, process.env.API_KEY);