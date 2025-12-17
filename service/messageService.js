const { validate } = require("validate.js");
const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { ValidationError } = require("../utils/errors");
const { getOneBlogDao } = require("../dao/blogDao");
const fs = require("fs");
const {
	addMessageDao,
	getAllMessageDao,
	deleteMessageDao
} = require("../dao/messageDao");
// 读取一个目录下多少个文件
async function readDirLength(dir) {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) {
				throw new UnknownError("无文件");
			} else {
				resolve(files);
			}
		});
	});
}
// 新增评论/留言
exports.addmessageService = async (newmessageInfo) => {
	// 新增的时候需要验证，比如：用户通过 postman 发送的请求而不是通过真实web 端项目发送的，使用validate.js来做验证
	/**
	 * 数据验证规则
	 */
	console.log(newmessageInfo, "newmessageInfo");
	const messageRule = {
		nickname: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		content: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		avatar: {
			presence: {
				allowEmpty: true
			},
			type: "string"
		},
		blogId: {
			type: "string"
		}
	};
	/**
	 *进行数据验证,validate.validate方法验证成功会返回 undefined
	 */
	const validateResult = validate.validate(newmessageInfo, messageRule);
	console.log(validateResult, "l");
	if (!validateResult) {
		newmessageInfo.blogId = newmessageInfo.blogId
			? newmessageInfo.blogId
			: null;
		// 评论/留言板的头像是随机生成的,读取public/static/avator下的文件
		const files = await readDirLength("./public/static/avator");
		console.log(files, "files");
		const randomIndex = Math.floor(Math.random() * files.length);
		newmessageInfo.avatar = `./public/static/${files[randomIndex]}`;
		// 新增
		const { dataValues } = await addMessageDao(newmessageInfo);
		console.log(dataValues, "dataValues");
		if (dataValues && newmessageInfo.blogId) {
			// 新增完将这篇文章的评论数+1
			const currentBlogInfo = await getOneBlogDao(newmessageInfo.blogId);
			currentBlogInfo.commentNumber++;
			await currentBlogInfo.save();
		}
		return dataValues;
	} else {
		throw new ValidationError("数据验证失败");
	}
};

// 获取评论/留言(带分页)
exports.getAllmessageService = async (pageInfo) => {
	return await getAllMessageDao(pageInfo);
};

// 删除一个评论/留言
exports.deleteOnemessageService = async (id) => {
	return await deleteMessageDao(id);
};
