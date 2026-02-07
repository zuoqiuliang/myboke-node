const { validate } = require("validate.js");
const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { ValidationError } = require("../utils/errors");
const blogTypeModel = require("../dao/model/blogTypeModel");
const {
	addBlogDao,
	getBlogByPageDao,
	getOneBlogDao,
	updateOneBlogDao,
	deleteOneBlogDao,
	getBlogsByUserIdDao,
	getRecommendedBlogsDao
} = require("../dao/blogDao");
const { addBlogTypeArcticleCount, getOneBlogTypeDao } = require("../dao/blogTypeDao");
const { addBlogTagDao } = require("../dao/blogTagDao");
const { formatFormDaoData, formatToc } = require("../utils/tool");
const { processHtmlImages } = require("../utils/imageUtil");
const { deleteMessageByBlogIdDao } = require("../dao/messageDao");
const { checkUserFavoriteDao } = require("../dao/userFavoriteDao");
const { getMessagesByBlogIdService } = require("./messageService");
const { checkUserLikeDao } = require("../dao/userLikeDao");
// 根据自定义属性categoryIdIsExist扩展校验规则
validate.validators.categoryIdIsExist = async function (value) {
	console.log(value, "value");
	const blogTypeInfo = await blogTypeModel.findByPk(value);
	if (blogTypeInfo) {
		return;
	} else {
		return "CategoryId is not exist";
	}
};

// 新增博客w文章
exports.addBlogService = async (newBlogInfo) => {
	// 第一个处理的是TOC 文章目录（下节课处理）
	// 初始化一些新增时的数据
	newBlogInfo.scanNumber = 0;
	newBlogInfo.commentNumber = 0;
	// 新增的时候需要验证，比如：用户通过 postman 发送的请求而不是通过真实web 端项目发送的，使用validate.js来做验证
	/**
	 * 数据验证规则
	 */
	const blogRule = {
		title: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		// 描述
		description: {
			presence: {
				allowEmpty: true
			},
			type: "string"
		},
		toc: {
			presence: {
				allowEmpty: true
			},
			type: "string"
		},
		htmlContent: {
			presence: {
				allowEmpty: true
			},
			type: "string"
		},
		markdownContent: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		thumb: {
			presence: {
				allowEmpty: true
			},
			type: "string"
		},
		// 文章浏览数
		scanNumber: {
			presence: {
				allowEmpty: false
			},
			type: "integer"
		},
		// 文章评论数
		commentNumber: {
			presence: {
				allowEmpty: false
			},
			type: "integer"
		},
		categoryId: {
			presence: true,
			type: "string",
			categoryIdIsExist: true //自定义扩展的一个属性
		},
		userId: {
			presence: true,
			type: "string"
		}
	};
	/**
	 *进行数据验证,validate.async方法是一个异步方法，由于校验对象的categoryId中有一个categoryIdIsExist自定义校验属性，所以使用validate的异步方法 async
	 */
	try {
		const validateResult = await validate.async(newBlogInfo, blogRule);
		console.log(validateResult, "l");
		const toc = formatToc(newBlogInfo.markdownContent);
		console.log(toc, "toc");
		newBlogInfo.toc = JSON.stringify(toc);
		const result = await addBlogDao(newBlogInfo);
		console.log(result.dataValues, "result!!!!!");
		if (result && result.dataValues && result.dataValues.toc) {
			result.dataValues.toc = JSON.parse(result.dataValues.toc);
		}
		if (result) {
			// 新增文章成功后把博客分类下的文章数加 1
			const updateResult = await addBlogTypeArcticleCount(newBlogInfo.categoryId);
			console.log(updateResult, "updateResult!!!!!");

			// // 处理文章标签关联
			// if (newBlogInfo.tags && newBlogInfo.tags.length > 0) {
			// 	const tagResult = await addBlogTagDao(result.id, newBlogInfo.tags);
			// 	console.log(tagResult, "tagResult!!!!!");
			// }

			return result;
		}
	} catch (error) {
		console.log("新增博客错误:", error);
		// 区分验证错误和其他错误
		if (error instanceof ValidationError) {
			throw error;
		} else {
			// 其他错误，返回更具体的信息
			throw new Error(`新增博客失败: ${error.message || error}`);
		}
	}
};

// 获取博客文章（带分页）
exports.getBlogByPageService = async (searchInfo, req) => {
	console.log(searchInfo, "searchInfo");
	const result = await getBlogByPageDao(searchInfo);
	console.log(result);
	const rows = formatFormDaoData(result.rows);
	rows.forEach((item) => {
		item.toc = JSON.parse(item.toc);
		// 处理 HTML 内容中的图片链接
		// if (item.htmlContent) {
		// 	item.htmlContent = processHtmlImages(item.htmlContent);
		// }
	});
	console.log(rows, "rows");

	return {
		total: result.count,
		rows
	};
};

// 获取一个博客文章
exports.getOneBlogService = async (id, userInfo, auth) => {
	const data = await getOneBlogDao(id);
	// 处理查出的这一条数据的 toc 还原成数组
	data.dataValues.toc = JSON.parse(data.dataValues.toc);
	// 处理 HTML 内容中的图片链接
	if (data.dataValues.htmlContent) {
		data.dataValues.htmlContent = processHtmlImages(data.dataValues.htmlContent);
	}
	// 判断当前用户是否收藏过这篇文章
	const isCollected = await checkUserFavoriteDao(userInfo.id, id);
	data.dataValues.isCollected = isCollected;
	// 判断当前用户是否点赞过这篇文章
	const isLiked = await checkUserLikeDao(userInfo.id, id);
	data.dataValues.isLiked = isLiked;
	// 获取文章评论列表
	const comments = await getMessagesByBlogIdService(id, 1, 50); // 一次获取50条评论
	data.dataValues.comments = comments.rows;
	data.dataValues.commentCount = comments.total;
	if (!auth) {
		// C端不登录也可以访问文章，需要把浏览数+1
		console.log(auth, "auth");
		data.scanNumber++;
		await data.save();
		return data.dataValues;
	} else {
		// B 端不用处理浏览数直接返回
		return data.dataValues;
	}
};

//修改一个博客分类
exports.updateOneBlogService = async (id, newBlogInfo) => {
	console.log(newBlogInfo);

	// 处理 TOC 目录
	if (newBlogInfo.htmlContent && newBlogInfo.markdownContent) {
		const toc = formatToc(newBlogInfo.markdownContent);
		newBlogInfo.toc = JSON.stringify(toc);
	}

	// 更新文章基本信息
	const result = await updateOneBlogDao(id, newBlogInfo);
	console.log(result);

	// 处理标签关联
	if (newBlogInfo.tags) {
		await addBlogTagDao(id, newBlogInfo.tags);
	}

	if (result[0] === 1 || result[0] === 0) {
		return await getOneBlogDao(id);
	}
};

// 删除一个博客文章
exports.deleteOneBlogService = async (id) => {
	const currentArticle = await getOneBlogDao(id);
	console.log(currentArticle.dataValues);
	// 该文章对应的分类下文章数-1
	const data = await getOneBlogTypeDao(currentArticle.dataValues.categoryId);
	data.arcticleCount--;
	await data.save();
	// 该文章下的评论也要删除，后边再加
	await deleteMessageByBlogIdDao(id);
	return await deleteOneBlogDao(id);
};

// 获取用户的文章（个人中心）
exports.getUserBlogsService = async (userId, page = 1, limit = 10) => {
	console.log(userId, "userId");
	const result = await getBlogsByUserIdDao(userId, page, limit);
	console.log(result, "result");
	const rows = formatFormDaoData(result.rows);
	rows.forEach((item) => {
		item.toc = JSON.parse(item.toc);
	});

	return {
		total: result.count,
		rows
	};
};

// 获取推荐文章（浏览数+评论数最多的前10篇）
exports.getRecommendedBlogsService = async (limit = 10) => {
	const result = await getRecommendedBlogsDao(limit);
	const rows = formatFormDaoData(result);
	rows.forEach((item) => {
		item.toc = JSON.parse(item.toc);
	});

	return rows;
};
