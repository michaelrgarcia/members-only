import { body } from "express-validator";

export const validateSignup = [
  body("firstname")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters long."),
  body("lastname")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters long."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entered value must be an email.")
    .isLength({ max: 255 })
    .withMessage("Email cannot be longer than 255 characters."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("confirm-password").custom((value: any, { req }) => {
    return value === req.body.password;
  }),
];
