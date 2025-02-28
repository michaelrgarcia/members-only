import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hash } from "bcrypt";

import {
  validatePasscode,
  validateSignup,
} from "./validators/indexValidators.js";
import { User } from "../db/queries.js";

export function indexGet(req: Request, res: Response) {
  console.log(req.user);
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

export function joinClubGet(req: Request, res: Response) {
  res.render("join");
}

export const joinClubPost = [
  validatePasscode,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("join", {
        errors: errors.array(),
      });
    }

    if (req.user) {
      try {
        await User().makeAdmin((req.user as any).id);

        res.redirect("/");
      } catch (err) {
        console.error(err);

        return next(err);
      }
    }
  },
];

export function loginGet(req: Request, res: Response) {
  res.render("login");
}
