var express = require("express");
var router = express.Router();
const { getCaptchaService } = require("../service/captchaService");
const { formatResponse, analysisToken } = require("../utils/tool");

// 获取验证码接口
router.get("/", async function (req, res, next) {
	const result = await getCaptchaService();
	req.session.captcha = result.text; //result.text是验证码的文本
	res.setHeader("Content-Type", "image/svg+xml");
	res.send(result.data); //result.data是图片
});

module.exports = router;
