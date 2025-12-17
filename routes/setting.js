var express = require("express");
var router = express.Router();
const {
	formatResponse,
	analysisToken,
	formatFormDaoData
} = require("../utils/tool");

const {
	getSettingService,
	setSettingService
} = require("../service/settingService");

// 获取全局网站信息接口
router.get("/", async function (req, res, next) {
	const result = await getSettingService();
	console.log(formatFormDaoData(result));
	res.send(formatResponse(200, "success", formatFormDaoData(result)));
});

// 设置全局网站信息
router.put("/", async function (req, res, next) {
	const result = await setSettingService(req.body);
	res.send(formatResponse(200, "success", formatFormDaoData(result)));
});
module.exports = router;
