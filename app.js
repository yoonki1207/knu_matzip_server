var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var winston = require("winston")
var morgan = require("morgan");
var {createProxyMiddleware} = require("http-proxy-middleware");


// database settings
require("dotenv").config({
	path: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.production",
});

var database = require("./database/database");

// import routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var mapsRouter = require("./routes/kakaomap");
var recmdRouter = require("./routes/recmd");

var app = express();
app.set('trust proxy', true);
// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

app.use((req, res, next) => {
	req.headers['x-forwarded-for'] = req.connection.remoteAddress;
	next();
});

app.use('/api', createProxyMiddleware({target: 'http://localhost:3002', changeOrigin:true}));

app.use(morgan({
	  format: ':req[X-Forwarded-For] (:remote-addr) :status :method :url :referrer :response-time ms :user-agent',
	  stream: {
		write: (message) => {
			winston.info(message);
		}
	  },
}));
//app.use(morgan("dev"));
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
	console.log(req.headers['x-forwarded-for'] || req.ip);
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
