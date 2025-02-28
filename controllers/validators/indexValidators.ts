import { body } from "express-validator";
import { config } from "dotenv";

config();

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
  body("confirm-password").custom((value: string, { req }) => {
    if (value === req.body.password) {
      return true;
    } else {
      throw new Error("Passwords do not match.");
    }
  }),
];

export const validatePasscode = [
  body("passcode").custom((value: string) => {
    if (value === process.env.PASSCODE) {
      return true;
    } else {
      throw new Error("Passcode is incorrect.");
    }
  }),
];
