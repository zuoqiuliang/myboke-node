const { validate } = require("validate.js");
const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { ValidationError } = require("../utils/errors");
const {
	addBlogTypeDao,
	getAllBlogTyoeDao,
	getOneBlogTypeDao,
	updateOneBlogTypeDao,
	deleteOneBlogTypeDao
} = require("../dao/blogTypeDao");
const { getAllBlogByCategoryIdDao } = require("../dao/blogDao");

// 新增博客分类
exports.addBlogTypeService = async (newBlogTypeInfo) => {
	console.log("新增博客分类请求数据:", newBlogTypeInfo);
	// 新增的时候需要验证，比如：用户通过 postman 发送的请求而不是通过真实web 端项目发送的，使用validate.js来做验证
	/**
	 * 数据验证规则
	 */
	const blogTypeRule = {
		name: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		order: {
			presence: {
				allowEmpty: false
			},
			type: "integer"
		},
		path: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		}
	};
	/**
	 *进行数据验证,validate.validate方法验证成功会返回 undefined
	 */
	const validateResult = validate.validate(newBlogTypeInfo, blogTypeRule);
	console.log("验证结果:", validateResult);
	if (!validateResult) {
		// 确保所有必填字段都有值
		newBlogTypeInfo.arcticleCount = newBlogTypeInfo.arcticleCount || 0;
		console.log("准备插入数据:", newBlogTypeInfo);
		try {
			const result = await addBlogTypeDao(newBlogTypeInfo);
			console.log("插入结果:", result);
			return result.dataValues;
		} catch (error) {
			console.error("数据库插入错误:", error);
			console.error("错误类型:", error.name);
			console.error("错误消息:", error.message);
			console.error("错误详情:", error);
			throw error;
		}
	} else {
		console.error("验证失败:", validateResult);
		throw new ValidationError("数据验证失败");
	}
};

// 获取博客分类
exports.getAllBlogTypeService = async (searchInfo) => {
	return await getAllBlogTyoeDao(searchInfo);
};

// 获取一个博客分类
exports.getOneBlogTypeService = async (id) => {
	return await getOneBlogTypeDao(id);
};

//修改一个博客分类
exports.updateOneBlogTypeService = async (id, newBlogTypeInfo) => {
	const result = await updateOneBlogTypeDao(id, newBlogTypeInfo);
	if (result[0] === 1) {
		return await getOneBlogTypeDao(id);
	}
};

// 删除一个博客分类
exports.deleteOneBlogTypeService = async (id) => {
	console.log(id);
	const data = await getAllBlogByCategoryIdDao(id);
	console.log(data, "count");
	await deleteOneBlogTypeDao(id);
	return data;
};
