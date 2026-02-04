var express = require("express");
var router = express.Router();
const { formatResponse } = require("../utils/tool");
const {
	addUserFavoriteService,
	deleteUserFavoriteService,
	checkUserFavoriteService,
	getUserFavoritesService
} = require("../service/userFavoriteService");

// 添加收藏
router.post("/", async function (req, res, next) {
	const { blogId } = req.body;
	const result = await addUserFavoriteService(req.userInfo.id, blogId);

	if (result.success) {
		res.send(formatResponse(200, "收藏成功", result.data));
	} else {
		res.send(formatResponse(400, result.message, null));
	}
});

// 取消收藏
router.delete("/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const result = await deleteUserFavoriteService(req.userInfo.id, blogId);
	res.send(formatResponse(200, "取消收藏成功", result));
});

// 检查是否已收藏
router.get("/check/:blogId", async function (req, res, next) {
	const { blogId } = req.params;
	const result = await checkUserFavoriteService(req.userInfo.id, blogId);
	res.send(formatResponse(200, "success", result));
});

// 获取用户收藏的文章列表
router.get("/", async function (req, res, next) {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const result = await getUserFavoritesService(req.userInfo.id, page, limit);
	res.send(formatResponse(200, "success", result));
});

module.exports = router;
