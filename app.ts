import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import indexRouter from "./routes/indexRouter.js";

import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { User } from "./db/queries.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetsPath = join(__dirname, "public");

const app = express();
const PORT = 3000;

app.use("/", indexRouter);

app.use(express.static(assetsPath));

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

      if (user.password !== password) {
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

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  res.status(500).send(err.message);
});
