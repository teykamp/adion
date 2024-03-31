import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
export function getConnection(){
    const SB = createClient(process.env.API_URL, process.env.API_KEY);
    return SB;
}