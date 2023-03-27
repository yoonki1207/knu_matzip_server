var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var winston = require("winston");
var morgan = require("morgan");
const logToFile = require("./utils/logToFile");

// node env settings
require("dotenv").config({
	path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
});

// database settings
var database = require("./database/database");

// import routers
var indexRouter = require("./controller/index");
var usersRouter = require("./controller/users");
var authRouter = require("./controller/auth");
var mapsRouter = require("./controller/kakaomap");
var recmdRouter = require("./controller/recmd");

var app = express();
app.set("trust proxy", true);
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use((req, res, next) => {
	req.headers["x-forwarded-for"] = req.connection.remoteAddress;
	next();
});

// log middleware
app.use(
	morgan({
		format:
			":req[X-Forwarded-For] (:remote-addr) :status :method :url :referrer :response-time ms :user-agent",
		stream: {
			write: (message) => {
				winston.info(message);
				logToFile(message);
			},
		},
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// use routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/maps", mapsRouter);
app.use("/recmd", recmdRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	console.log(req.headers["x-forwarded-for"] || req.ip);
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "dev" ? err : {};

	// render the error page
	res.status(err.status || 500).send(err.message);
	// res.render("error");
});

module.exports = app;
