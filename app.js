var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { expressjwt: exressJwt } = require("express-jwt");
const md5 = require("md5");
const session = require("express-session");
const { ForbiddenError, ServiceError, UnknownError } = require("./utils/errors");
require("dotenv").config(); //默认读取项目根目录下.env 环境变量文件
// 引入数据库连接并且初始化数据库表
require("./dao/db");
require("express-async-errors");
const { exClude } = require("./utils/exClude");
const { analysisCookieToken } = require("./utils/tool");
const jwt = require("jsonwebtoken");
const { checkUserExistDao } = require("./dao/userDao");

var app = express();
var adminRouter = require("./routes/admin");
const captchaRouter = require("./routes/captcha");
const bannerRouter = require("./routes/banner");
const uploadRouter = require("./routes/upload");
const blogTypeRouter = require("./routes/blogType");
const blogRouter = require("./routes/blog");
const demoRouter = require("./routes/demo");
const messageRouter = require("./routes/message");
const settingRouter = require("./routes/setting");
const userRouter = require("./routes/user");
const userInfoRouter = require("./routes/userInfo");
// 图片代理路由
const proxyRouter = require("./routes/proxy");
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		name: "sessionId" //sessionid 的名字，也是浏览器保存在 cookie 中的 key
	})
);
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "public")));
// 配置验证 token中间件
// app.use(
// 	exressJwt({
// 		secret: md5(process.env.JWT_SECRET), //所设置的密钥
// 		algorithms: ["HS256"] //加密采用哪种算法
// 	}).unless({
// 		path: [
// 			{ url: "/api/admin/login", methods: ["POST"] },
// 			{ url: "/res/captcha", methods: ["GET"] },
// 			{ url: "/api/banner", methods: ["GET"] },
// 			{ url: "/api/blogType", methods: ["GET"] },
// 			{ url: "/api/blog", methods: ["GET"] },
// 			{ url: /\api\/blog\/\d/, methods: ["GET"] }, //排除规则支持正则
// 			{ url: "/api/project", methods: ["GET"] },
// 			{ url: "/api/message", methods: ["GET", "POST"] },
// 			{ url: "/api/user/register", methods: ["POST"] },
// 			{ url: "/api/user/login", methods: ["POST"] }
// 		]
// 	})
// );
// cookie自定义校验
app.use(async (req, res, next) => {
	if (
		exClude.find((item) => item.url === req.path && item.methods.includes(req.method))
	) {
		next();
	} else {
		const token = req.signedCookies.token;
		console.log(token, "=======token");
		if (!token) {
			throw new ForbiddenError("未登录 或登录已过期");
		}
		const userInfo = analysisCookieToken(token);
		console.log(userInfo, "=======userInfo");
		// 通过 token 解析出userC 表的id去校验用户是否真实存在，以防被攻击篡改了token中的id
		const userExist = await checkUserExistDao(userInfo.id);
		if (!userExist) {
			throw new ForbiddenError("用户不存在");
		}
		// 校验通过，将用户信息挂载到 req 上，后续路由可以直接使用
		req.userInfo = userInfo;
		next();
	}
});
app.use("/api/admin", adminRouter);
app.use("/res/captcha", captchaRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogType", blogTypeRouter);
app.use("/api/blog", blogRouter);
app.use("/api/project", demoRouter);
app.use("/api/message", messageRouter);
app.use("/api/comment", messageRouter);
app.use("/api/setting", settingRouter);
app.use("/api/user", userRouter);
app.use("/api/userInfo", userInfoRouter);
app.use("/api/proxy", proxyRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// 错误处理中间件
app.use(function (err, req, res, next) {
	// 任何中间件 throw 抛出的 error 都会直接到此中间件
	console.log(err.name, "app.js 错误中间件");
	if (err.name === "UnauthorizedError") {
		res.send(new ForbiddenError("未登录 或登录已过期").toResponseJSON());
	} else if (err instanceof ServiceError) {
		res.send(err.toResponseJSON());
	} else {
		res.send(new UnknownError().toResponseJSON());
	}
});

module.exports = app;
