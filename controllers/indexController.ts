import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hash } from "bcrypt";

import { validateSignup } from "./validators/indexValidators.js";
import { User } from "../db/queries.js";

export function indexGet(req: Request, res: Response) {
  res.render("index");
}

export function signupGet(req: Request, res: Response) {
  res.render("signup");
}

export const signupPost = [
  validateSignup,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("signup", {
        errors: errors.array(),
      });
    }

    const { firstname, lastname, email, password } = req.body;

    const hashedPassword = await hash(password, 10);

    try {
      await User().create(firstname, lastname, email, hashedPassword);

      res.redirect("/login");
    } catch (err) {
      console.error(err);

      return next(err);
    }
  },
];
