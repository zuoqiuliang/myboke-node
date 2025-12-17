var express = require("express");
var router = express.Router();
const {
	formatResponse,
	analysisToken,
	formatFormDaoData
} = require("../utils/tool");
const {
	getAllDemoService,
	addDemoService,
	getOneDemoService,
	updateOneDemoService,
	deleteOneDemoService
} = require("../service/demoService");

// 获取项目
router.get("/", async function (req, res, next) {
	const result = await getAllDemoService();
	result.sort((a, b) => {
		return a.order - b.order;
	});
	res.send(formatResponse(200, "success", result));
});
// 添加项目
router.post("/", async function (req, res, next) {
	const result = await addDemoService(req.body);
	res.send(formatResponse(200, "success", [result]));
});

// 获取其中一个项目
router.get("/:id", async function (req, res, next) {
	const result = await getOneDemoService(req.params.id);
	res.send(formatResponse(200, "success", result));
});
// 修改一个项目
router.put("/:id", async function (req, res, next) {
	const result = await updateOneDemoService(req.params.id, req.body);
	console.log(result);
	res.send(formatResponse(200, "success", result));
});
// 删除一个项目
router.delete("/:id", async function (req, res, next) {
	const result = await deleteOneDemoService(req.params.id);
	res.send(formatResponse(200, "success", "删除成功"));
});

module.exports = router;
