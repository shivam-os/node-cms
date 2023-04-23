import * as yup from "yup";

//Validations for checking the user registration form values
export const userRegisterSchema = yup
  .object({
    name: yup.string().trim().min(3).max(100).required(),
    email: yup.string().trim().lowercase().email().required(),
    password: yup
      .string()
      .trim()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        {
          message:
            "Password must be atleast 8 characters long & must include one- uppercase letter, lowercase letter, special character & digit!",
          excludeEmptyString: true,
        }
      )
      .required(),
  })
  .required();

//Validations for checking user login form values
export const userLoginSchema = yup
  .object({
    email: yup.string().trim().lowercase().email().required(),
    password: yup.string().trim().required(),
  })
  .required();
