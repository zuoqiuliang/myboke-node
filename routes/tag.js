const express = require("express");
const router = express.Router();
const {
	addTagDao,
	getAllTagDao,
	getTagTreeDao,
	getOneTagDao,
	updateOneTagDao,
	deleteOneTagDao
} = require("../dao/tagDao");
const { formatResponse } = require("../utils/tool");

// 获取所有标签
router.get("/", async (req, res, next) => {
	try {
		const result = await getAllTagDao();
		res.send(formatResponse(200, "success", result));
	} catch (error) {
		console.error("获取标签失败:", error);
		res.send(formatResponse(500, "获取标签失败", null));
	}
});

// 获取标签树结构
router.get("/tree", async (req, res, next) => {
	try {
		const result = await getTagTreeDao();
		res.send(formatResponse(200, "success", result));
	} catch (error) {
		console.error("获取标签树失败:", error);
		res.send(formatResponse(500, "获取标签树失败", null));
	}
});

// 添加标签
router.post("/", async (req, res, next) => {
	try {
		const result = await addTagDao(req.body);
		res.send(formatResponse(200, "添加标签成功", result.dataValues));
	} catch (error) {
		console.error("添加标签失败:", error);
		res.send(formatResponse(500, "添加标签失败", null));
	}
});

// 获取单个标签
router.get("/:id", async (req, res, next) => {
	try {
		const result = await getOneTagDao(req.params.id);
		res.send(formatResponse(200, "success", result));
	} catch (error) {
		console.error("获取标签失败:", error);
		res.send(formatResponse(500, "获取标签失败", null));
	}
});

// 更新标签
router.put("/:id", async (req, res, next) => {
	try {
		const result = await updateOneTagDao(req.params.id, req.body);
		if (result[0] === 1 || result[0] === 0) {
			const updatedTag = await getOneTagDao(req.params.id);
			res.send(formatResponse(200, "更新标签成功", updatedTag));
		} else {
			res.send(formatResponse(400, "更新标签失败", null));
		}
	} catch (error) {
		console.error("更新标签失败:", error);
		res.send(formatResponse(500, "更新标签失败", null));
	}
});

// 删除标签
router.delete("/:id", async (req, res, next) => {
	try {
		const result = await deleteOneTagDao(req.params.id);
		res.send(formatResponse(200, "删除标签成功", { count: result }));
	} catch (error) {
		console.error("删除标签失败:", error);
		res.send(formatResponse(500, "删除标签失败", null));
	}
});

module.exports = router;
