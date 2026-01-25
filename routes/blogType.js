var express = require("express");
var router = express.Router();
const { formatResponse, analysisToken, formatFormDaoData } = require("../utils/tool");
const {
	addBlogTypeService,
	getOneBlogTypeService,
	updateOneBlogTypeService,
	deleteOneBlogTypeService,
	getAllBlogTypeService
} = require("../service/blogTypeService");

// 获取博客分类
router.get("/", async function (req, res, next) {
	const result = await getAllBlogTypeService();
	result.sort((a, b) => {
		return a.order - b.order;
	});
	res.send(formatResponse(200, "success", result));
});
// 添加博客分类
router.post("/", async function (req, res, next) {
	try {
		const result = await addBlogTypeService(req.body);
		res.send(formatResponse(200, "success", result));
	} catch (error) {
		console.error("新增博客类型错误:", error);
		console.error("错误详情:", error.stack);
		console.error("请求数据:", req.body);
		res.send(formatResponse(500, `新增博客类型失败: ${error.message}`, null));
	}
});

// 获取其中一个博客分类
router.get("/:id", async function (req, res, next) {
	const result = await getOneBlogTypeService(req.params.id);
	res.send(formatResponse(200, "success", result));
});
// 修改一个博客分类
router.put("/:id", async function (req, res, next) {
	const result = await updateOneBlogTypeService(req.params.id, req.body);
	console.log(result);
	res.send(formatResponse(200, "success", result));
});
// 删除一个博客分类
router.delete("/:id", async function (req, res, next) {
	const result = await deleteOneBlogTypeService(req.params.id);
	res.send(
		formatResponse(200, "success", {
			count: result,
			msg: "删除成功"
		})
	);
});

module.exports = router;
