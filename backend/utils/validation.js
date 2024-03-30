export default function validate_UserJson(new_user) {
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