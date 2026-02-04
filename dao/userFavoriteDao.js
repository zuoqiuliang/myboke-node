const userFavoriteModel = require("./model/userFavoriteModel");
const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");
const userCModel = require("./model/userCModel");
const userInfoModel = require("./model/userInfoModel");
const tagModel = require("./model/tagModel");

// 添加收藏
exports.addUserFavoriteDao = async (userId, blogId) => {
	// 检查是否已收藏
	const existing = await userFavoriteModel.findOne({
		where: {
			userId,
			blogId
		}
	});
	if (existing) {
		return { success: false, message: "已经收藏过了" };
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
	// 创建收藏记录
	const result = await userFavoriteModel.create({
		userId,
		blogId
	});
	console.log(result, "result");
	return { success: true, data: result };
};

// 取消收藏
exports.deleteUserFavoriteDao = async (userId, blogId) => {
	const result = await userFavoriteModel.destroy({
		where: {
			userId,
			blogId
		}
	});

	return { success: true, deleted: result };
};

// 检查是否已收藏
exports.checkUserFavoriteDao = async (userId, blogId) => {
	const result = await userFavoriteModel.findOne({
		where: {
			userId,
			blogId
		}
	});

	return result ? true : false;
};

// 获取用户收藏的文章列表
exports.getUserFavoritesDao = async (userId, page = 1, limit = 10) => {
	const offset = (page - 1) * limit;
	console.log(userId, "userId");
	return await userFavoriteModel.findAndCountAll({
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
