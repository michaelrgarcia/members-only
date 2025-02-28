import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hash } from "bcrypt";

import {
  validateAdminPasscode,
  validatePasscode,
  validateSignup,
} from "./validators/indexValidators.js";
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
        await User().makeMember((req.user as any).id);

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

export function logoutGet(req: Request, res: Response, next: NextFunction) {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }

    res.redirect("/");
  });
}

export function becomeAdminGet(req: Request, res: Response) {
  res.render("become-admin");
}

export const becomeAdminPost = [
  validateAdminPasscode,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("become-admin", {
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

export function newMessageGet(req: Request, res: Response) {
  res.render("new-message");
}
