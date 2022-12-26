import express from "express";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import expressMySQLSession from "express-mysql-session";
import { fileURLToPath } from "url";

import routes from "./routes/index.js";
import { port } from "./config.js";
import "./lib/passport.js";
import { pool } from "./database.js";

//html로 바꾸기위해
/*import { createRequire } from 'module';
const require = createRequire(import.meta.url);*/

// Intializations
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MySQLStore = expressMySQLSession(session);

// Public
app.use(express.static(path.join(__dirname, "public")));

// Settings
app.set("views", path.join(__dirname, "views"));
console.log("dir name : " + __dirname);
/*app.engine(
  ".html",
  create({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".html",
    helpers
  }).engine
);*/
app.set("view engine", ".ejs");
//app.engine('html', require('ejs').renderFile);

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("faztmysqlnodemysql"));
app.use(
  session({
    secret: "faztmysqlnodemysql",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore({}, pool),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  app.locals.errors = req.flash("errors");
  app.locals.user = req.user;
  next();
});

// Routes
app.use(routes);

export default app;
