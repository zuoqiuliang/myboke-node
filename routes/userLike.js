var express = require("express");
var router = express.Router();
const { formatResponse } = require("../utils/tool");
const {
	addUserLikeService,
	deleteUserLikeService,
	checkUserLikeService,
	getBlogLikeCountService,
	getUserLikedBlogsService
} = require("../service/userLikeService");

// 添加点赞
router.post("/", async function (req, res, next) {
	const { blogId } = req.body;
	const result = await addUserLikeService(req.userInfo.id, blogId);

	if (result.success) {
		res.send(formatResponse(200, "点赞成功", result.data));
	} else {
		res.send(formatResponse(400, result.message, null));
	}
});

// 取消点赞
router.delete("/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const result = await deleteUserLikeService(req.userInfo.id, blogId);
	res.send(formatResponse(200, "取消点赞成功", result));
});

// 检查是否已点赞
router.get("/check/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const result = await checkUserLikeService(req.userInfo.id, blogId);
	res.send(formatResponse(200, "success", result));
});

// 获取文章点赞数
router.get("/count/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const result = await getBlogLikeCountService(blogId);
	res.send(formatResponse(200, "success", result));
});

// 获取用户点赞的文章列表
router.get("/", async function (req, res, next) {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const result = await getUserLikedBlogsService(req.userInfo.id, page, limit);
	res.send(formatResponse(200, "success", result));
});

module.exports = router;