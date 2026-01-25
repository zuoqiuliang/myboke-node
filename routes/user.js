var express = require("express");
var router = express.Router();
const { formatResponse, analysisToken } = require("../utils/tool");
const { ValidationError } = require("../utils/errors");
const { registerUserService, loginUserService } = require("../service/userService");

// 注册接口
router.post("/register", async function (req, res, next) {
	console.log(req.body, "=======");
	const result = await registerUserService(req.body);
	res.send(formatResponse(200, "注册成功", result));
});

// 登录接口
router.post("/login", async function (req, res, next) {
	console.log(req.body, "=======");
	// 拿到用户登录的信息后 首先要进行验证码验证
	// if (req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
	// 	// 只要 throw 错误后，后续代码就不会执行了
	// 	throw new ValidationError("验证码错误");
	// }
	// 第 2 步进行账号密码验证
	const result = await loginUserService(req.body);
	console.log("包装的结果", result);
	if (result.token) {
		// res.setHeader("authentication", result.token);
		res.cookie("token", result.token, {
			maxAge: 60 * 60 * 24 * 1000 * parseInt(result.remember),
			signed: true
		});
	}
	delete result.token;
	res.send(formatResponse(200, "success", result));
});

module.exports = router;
