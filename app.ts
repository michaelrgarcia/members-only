import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { User } from "./db/queries.js";
import { compare } from "bcrypt";
import {
  indexGet,
  joinClubGet,
  loginGet,
  signupGet,
  signupPost,
} from "./controllers/indexController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({ secret: "regulus", resave: false, saveUninitialized: false })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (email: string, password: string, done) => {
    try {
      const user = await User().getByEmail(email);

      if (!user) {
        return done(null, false, { message: "Email not found" });
      }

      const match = await compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err: any) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User().getById(id);

    done(null, user);
  } catch (err: any) {
    done(err);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;

  next();
});

app.get("/", indexGet);

app.get("/signup", signupGet);
app.post("/signup", signupPost as any);

app.get("/login", loginGet);
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/join", joinClubGet);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).send(err.message);
});
