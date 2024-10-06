import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import createError from "http-errors";
import logger from "morgan";
import path from "path";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const app = express();

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "hbs");

// Security middleware for production
if (app.get("env") === "production") {
  app.use(helmet());
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);
}

// Development logging
if (app.get("env") === "development") {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.locals.message = status === 500 ? "Internal Server Error" : err.message;

  if (app.get("env") === "development") {
    res.locals.error = err;
  } else {
    res.locals.error = {};
  }

  res.status(status);
  res.render("error");
});

export default app;
