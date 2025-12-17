var express = require("express");
var router = express.Router();
const {
	formatResponse,
	analysisToken,
	formatFormDaoData
} = require("../utils/tool");

const {
	addmessageService,
	getAllmessageService,
	deleteOnemessageService
} = require("../service/messageService");

// 获取留言/评论(带分页)
router.get("/", async function (req, res, next) {
	const result = await getAllmessageService(req.query);
	res.send(formatResponse(200, "success", result));
});
// 添加留言/评论
router.post("/", async function (req, res, next) {
	const result = await addmessageService(req.body);
	console.log(result);
	res.send(formatResponse(200, "success", result));
});

// 删除一个留言/评论
router.delete("/:id", async function (req, res, next) {
	const result = await deleteOnemessageService(req.params.id);
	console.log(result);
	res.send(formatResponse(200, "success", "删除成功"));
});

module.exports = router;
