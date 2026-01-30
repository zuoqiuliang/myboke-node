var express = require("express");
var router = express.Router();
const { loginService, updateAdminAccountInfo } = require("../service/adminService");
const { formatResponse, analysisToken } = require("../utils/tool");
const { ValidationError } = require("../utils/errors");

// 登录接口
router.post("/login", async function (req, res, next) {
	console.log(req.body, "=======");
	// 拿到用户登录的信息后 首先要进行验证码验证
	// if (req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
	// 	// 只要 throw 错误后，后续代码就不会执行了
	// 	throw new ValidationError("验证码错误");
	// }
	// 第 2 步进行账号密码验证
	const result = await loginService(req.body);
	console.log("包装的结果", result);
	if (result.token) {
		// res.setHeader("authentication", result.token);
		res.cookie("token", result.token, {
			maxAge: 60 * 60 * 24 * 1000 * parseInt(result.remember),
			signed: true
		});
	}
	res.send(formatResponse(200, "success", result.data));
});

// 恢复登录接口
router.get("/whoami", async function (req, res, next) {
	// 从客户端拿到 token
	console.log(req.get("Authorization"), "=======");
	const token = req.get("Authorization");
	// 解析token 还原成有用的信息
	if (token) {
		const result = analysisToken(token);
		console.log(result);
		res.send(
			formatResponse(200, "success", {
				loginId: result.loginId,
				name: result.name,
				id: result.id
			})
		);
	}
});

//修改管理员信息
router.put("/updateAccount", async (req, res, next) => {
	console.log(req.body);
	const result = await updateAdminAccountInfo(req.body);
	console.log(result);
	res.send(result);
});
module.exports = router;
