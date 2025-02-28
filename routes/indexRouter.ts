import { Router } from "express";
import {
  indexGet,
  signupGet,
  signupPost,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", indexGet);

indexRouter.get("/signup", signupGet);
indexRouter.post("/signup", signupPost as any);

export default indexRouter;
