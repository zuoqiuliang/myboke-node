var express = require("express");
var router = express.Router();
const { formatResponse } = require("../utils/tool");
const {
	addMessageService,
	deleteMessageService,
	getMessagesByBlogIdService,
	getAllMessagesService
} = require("../service/messageService");

// 添加评论
router.post("/", async function (req, res, next) {
	const { blogId, content } = req.body;
	const userId = req.userInfo.id;

	if (!blogId) {
		res.send(formatResponse(400, "文章ID不能为空", null));
		return;
	}

	const result = await addMessageService(userId, blogId, content);

	if (result.success) {
		res.send(formatResponse(200, "评论成功", result.data));
	} else {
		res.send(formatResponse(400, result.message, null));
	}
});

// 删除评论
router.delete("/:messageId", async function (req, res, next) {
	const { messageId } = req.params;
	const userId = req.userInfo.id;

	const result = await deleteMessageService(messageId, userId);

	if (result.success) {
		res.send(formatResponse(200, "删除评论成功", result));
	} else {
		res.send(formatResponse(400, result.message, null));
	}
});

// 根据文章ID获取评论列表
router.get("/blog/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20;

	const result = await getMessagesByBlogIdService(blogId, page, limit);
	res.send(formatResponse(200, "success", result));
});

// 获取所有用户评论（带分页）
router.get("/all", async function (req, res, next) {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 20;

	const result = await getAllMessagesService(page, limit);
	res.send(formatResponse(200, "success", result));
});

module.exports = router;
