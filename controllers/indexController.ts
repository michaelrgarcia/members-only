import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { hash } from "bcrypt";

import {
  validateAdminPasscode,
  validateMessage,
  validatePasscode,
  validateSignup,
} from "./validators/indexValidators.js";
import { User, Message } from "../db/queries.js";

export async function indexGet(req: Request, res: Response) {
  const messages = await Message().getAllMessages();

  res.render("index", { messages: messages });
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
  if (!req.user) {
    res.status(401).send("You must be logged in to join the club.");
  }

  res.render("join");
}

export const joinClubPost = [
  validatePasscode,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).send("You must be logged in to join the club.");
    }

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
  if (!(req.user as any).member) {
    res.status(401).send("You must be a member to become an admin.");
  }

  res.render("become-admin");
}

export const becomeAdminPost = [
  validateAdminPasscode,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!(req.user as any).member) {
      res.status(401).send("You must be a member to become an admin.");
    }

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
  if (!req.user) {
    res.status(401).send("Please log in to create a message.");
  }

  res.render("new-message");
}

export const newMessagePost = [
  validateMessage,
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).send("Please log in to create a message.");
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("new-message", {
        errors: errors.array(),
      });
    }

    const { title, content } = req.body;

    try {
      await Message().create(title, content, Number((req.user as any).id));

      res.redirect("/");
    } catch (err) {
      console.error(err);

      return next(err);
    }
  },
];

export async function deleteMsgGet(req: Request, res: Response) {
  if (!(req.user as any).admin) {
    res.status(401).send("Oops! Only admins can delete messages.");
  }

  const { msgId } = req.params;

  await Message().deleteMsg(Number(msgId));

  res.redirect("/");
}
