var express = require("express");
var router = express.Router();
const {
	formatResponse,
	analysisToken,
	formatFormDaoData
} = require("../utils/tool");
const {
	getBannerService,
	setBannerService
} = require("../service/bannerSerice");

// 获取首页标语接口
router.get("/", async function (req, res, next) {
	const result = await getBannerService();
	console.log(formatFormDaoData(result));
	res.send(formatResponse(200, "success", formatFormDaoData(result)));
});

// 设置首页标语
router.post("/", async function (req, res, next) {
	const bannerArr = req.body;
	console.log(bannerArr);
	const result = await setBannerService(bannerArr);
	res.send(formatResponse(200, "success", formatFormDaoData(result)));
});
module.exports = router;
