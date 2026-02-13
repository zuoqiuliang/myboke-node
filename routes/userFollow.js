const express = require("express");
const router = express.Router();
const userFollowService = require("../service/userFollowService");
const { formatResponse } = require("../utils/tool");

// 关注用户
router.post("/follow/:id", async (req, res, next) => {
	try {
		const { id: followingId } = req.params;
		const followerId = req.userInfo.id;
		console.log(followerId, followingId);
		const result = await userFollowService.followUser(followerId, followingId);
		res.send(formatResponse(200, "关注成功", result));
	} catch (error) {
		next(error);
	}
});

// 取消关注
router.post("/unfollow/:id", async (req, res, next) => {
	try {
		const { id: followingId } = req.params;
		const followerId = req.userInfo.id;

		const result = await userFollowService.unfollowUser(followerId, followingId);
		res.send(formatResponse(200, "取消关注成功", result));
	} catch (error) {
		next(error);
	}
});

// 获取我的关注列表
router.get("/following", async (req, res, next) => {
	try {
		const userId = req.userInfo.id;
		const { page, pageSize } = req.query;

		const result = await userFollowService.getFollowingList(userId, {
			page: parseInt(page) || 1,
			pageSize: parseInt(pageSize) || 20
		});
		res.send(formatResponse(200, "获取关注列表成功", result));
	} catch (error) {
		next(error);
	}
});

// 获取我的粉丝列表
router.get("/followers", async (req, res, next) => {
	try {
		const userId = req.userInfo.id;
		const { page, pageSize } = req.query;

		const result = await userFollowService.getFollowersList(userId, {
			page: parseInt(page) || 1,
			pageSize: parseInt(pageSize) || 20
		});
		res.send(formatResponse(200, "获取粉丝列表成功", result));
	} catch (error) {
		next(error);
	}
});

// 检查关注状态
router.get("/status/:id", async (req, res, next) => {
	try {
		const { id: followingId } = req.params;
		const followerId = req.userInfo.id;

		const result = await userFollowService.checkFollowStatus(followerId, followingId);
		res.send(formatResponse(200, "检查关注状态成功", result));
	} catch (error) {
		next(error);
	}
});

// 获取关注和粉丝数量
router.get("/counts", async (req, res, next) => {
	try {
		const userId = req.userInfo.id;

		const result = await userFollowService.getFollowCounts(userId);
		res.send(formatResponse(200, "获取关注数量成功", result));
	} catch (error) {
		next(error);
	}
});

module.exports = router;
