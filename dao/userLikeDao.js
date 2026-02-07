const userLikeModel = require("./model/userLikeModel");
const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");
const userCModel = require("./model/userCModel");
const userInfoModel = require("./model/userInfoModel");
const tagModel = require("./model/tagModel");

// 添加点赞
exports.addUserLikeDao = async (userId, blogId) => {
	// 检查是否已点赞
	const existing = await userLikeModel.findOne({
		where: {
			userId,
			blogId
		}
	});
	if (existing) {
		return { success: false, message: "已经点赞过了" };
	}

	// 验证外键存在性
	const blogExists = await blogModel.findByPk(blogId);
	if (!blogExists) {
		return { success: false, message: "文章不存在" };
	}

	const userExists = await userCModel.findByPk(userId);
	if (!userExists) {
		return { success: false, message: "用户不存在" };
	}
	// 创建点赞记录
	const result = await userLikeModel.create({
		userId,
		blogId
	});
	return { success: true, data: result };
};

// 取消点赞
exports.deleteUserLikeDao = async (userId, blogId) => {
	const result = await userLikeModel.destroy({
		where: {
			userId,
			blogId
		}
	});

	return { success: true, deleted: result };
};

// 检查是否已点赞
exports.checkUserLikeDao = async (userId, blogId) => {
	const result = await userLikeModel.findOne({
		where: {
			userId,
			blogId
		}
	});

	return result ? true : false;
};

// 获取文章点赞数
exports.getBlogLikeCountDao = async (blogId) => {
	const count = await userLikeModel.count({
		where: {
			blogId
		}
	});

	return count;
};

// 获取用户点赞的文章列表
exports.getUserLikedBlogsDao = async (userId, page = 1, limit = 10) => {
	const offset = (page - 1) * limit;
	return await userLikeModel.findAndCountAll({
		where: {
			userId
		},
		include: [
			{
				model: blogModel,
				as: "blog",
				include: [
					{
						model: blogTypeModel,
						as: "category"
					},
					{
						model: userInfoModel,
						as: "userInfo"
					},
					{
						model: tagModel,
						as: "tags"
					}
				]
			}
		],
		offset: offset,
		limit: limit,
		order: [["createdAt", "DESC"]]
	});
};