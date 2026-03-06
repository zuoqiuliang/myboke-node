var express = require("express");
var router = express.Router();
const { formatResponse, analysisToken } = require("../utils/tool");
const { ValidationError } = require("../utils/errors");
const {
	registerUserService,
	loginUserService,
	getUserInfoService,
	getUserInfoByIdService,
	updateUserInfoService
} = require("../service/userService");

// 查询用户信息
router.get("/", async function (req, res, next) {
	console.log(req.userInfo, "=======userInfo");
	const userInfo = await getUserInfoService(req.userInfo.id);
	res.send(formatResponse(200, "success", userInfo));
});

// 更新用户信息接口
router.post("/update", async function (req, res, next) {
	console.log(req.userInfo, "=======userInfo 是你吗");
	const result = await updateUserInfoService(req.userInfo.id, req.body);
	res.send(formatResponse(200, "更新成功", result));
});

// 通过用户ID查询用户信息
router.get("/:id", async function (req, res, next) {
	try {
		const { id } = req.params;
		const userInfo = await getUserInfoByIdService(id);
		res.send(formatResponse(200, "success", userInfo));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
