import express from "express";
import router from express.Router;
import validate_UserJson from "../utils/validation";
import userInput_ErrFlags from "../utils/errorflags"

  /**
   * @typedef {{
  * "first_name" : string,
  * last_name: string
  * gender:string,
  * pronouns: string,
  * email: string
  * }} user
  */

// get specific user
router.get("/users/:uuid", async (req, res) => {
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
router.post("/users/create", async (req, res) => {
    /**
     * @type{user}
     */
    const new_user = req.body;
    new_user.id = crypto.randomUUID();
  
    const errors = validate_UserJson(new_user);
    if (errors.length != 0) {
      let error_string = "";
      errors.forEach((err) => {
        error_string = error_string + userInput_ErrFlags[err] + "\n";
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
router.delete("/users/:uuid", async (req, res) => {
    const user_uuid = req.params.uuid;
    const { error } = await SB.from("User").delete().eq("id", user_uuid);

    if (error) {
        res.status(400).json({ error: error });
        return;
    }
    res.status(200).json({ data: `user ${user_uuid} deleted` });
});
  
// update user  
router.put("/users/:uuid", async (req, res) => {
/**
 * @type{user}
 */
    const new_data = req.body;

    // valdiate user fields
    const errors = validate_UserJson(new_data);
    if (errors.length != 0) {
        let error_string = "";
        errors.forEach((err) => {
        error_string = error_string + userInput_ErrFlags[err] + "\n";
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
  
export default router;
