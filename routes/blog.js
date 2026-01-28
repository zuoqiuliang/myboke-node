var express = require("express");
var router = express.Router();
const { formatResponse, analysisToken, formatFormDaoData } = require("../utils/tool");

const {
	addBlogService,
	getBlogByPageService,
	getOneBlogService,
	updateOneBlogService,
	deleteOneBlogService
} = require("../service/blogService");

// 获取文章带分页的
router.get("/", async function (req, res, next) {
	const result = await getBlogByPageService(req.query);
	res.send(formatResponse(200, "success", result));
});
// 添加一篇文章
router.post("/", async function (req, res, next) {
	console.log(req.body, "=======添加文章");
	const result = await addBlogService({ userId: req.userInfo.id, ...req.body });
	console.log(result);
	res.send(formatResponse(200, "success", result));
});

// 获取其中一个博客文章
router.get("/:id", async function (req, res, next) {
	// 由于在 C 端每次刷新都算浏览记录+1，在 B 端不算，且 C 端不登录也可以查看文章，所以通过 B 端在请求头传递authorization而 C 端不传递来判断是否浏览记录+1
	const result = await getOneBlogService(req.params.id);
	res.send(formatResponse(200, "success", result));
});
// 修改一个博客文章
router.put("/:id", async function (req, res, next) {
	const result = await updateOneBlogService(req.params.id, req.body);
	console.log(result);
	res.send(formatResponse(200, "success", result));
});
// 删除一个博客文章
router.delete("/:id", async function (req, res, next) {
	const result = await deleteOneBlogService(req.params.id);
	console.log(result);
	res.send(formatResponse(200, "success", "删除成功"));
});

module.exports = router;
