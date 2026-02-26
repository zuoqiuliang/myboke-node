var express = require("express");
var router = express.Router();
const {
	formatResponse,
	analysisToken,
	formatFormDaoData,
	uploading,
	getDomainByEnv
} = require("../utils/tool");
console.log(getDomainByEnv(), "getDomainByEnv");
const { UploadError } = require("../utils/errors");
const multer = require("multer");
// 上传图片
router.post("/", async function (req, res, next) {
	const bannerArr = req.body;
	// single方法中书写上传控件的 name 值，element-ui 的 upload 组件的input 的 name值为 file
	uploading.single("file")(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// 发生错误
			next(new UploadError("上传文件失败,请检查文件大小，控制在 2MB 以内"));
		} else {
			// 一切都好
			const path = "/static/uploads/" + req.file.filename;
			const localPath = `${getDomainByEnv()}${path}`;
			res.send(
				formatResponse(
					200,
					"success",
					process.env.NODE_ENV === "production" ? path : localPath
				)
			);
		}
	});
});
module.exports = router;
