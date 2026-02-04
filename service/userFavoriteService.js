const {
	addUserFavoriteDao,
	deleteUserFavoriteDao,
	checkUserFavoriteDao,
	getUserFavoritesDao
} = require("../dao/userFavoriteDao");
const { formatFormDaoData } = require("../utils/tool");

// 添加收藏
exports.addUserFavoriteService = async (userId, blogId) => {
	const result = await addUserFavoriteDao(userId, blogId);
	return result;
};

// 取消收藏
exports.deleteUserFavoriteService = async (userId, blogId) => {
	const result = await deleteUserFavoriteDao(userId, blogId);
	return result;
};

// 检查是否已收藏
exports.checkUserFavoriteService = async (userId, blogId) => {
	const isFavorited = await checkUserFavoriteDao(userId, blogId);
	return { isFavorited };
};

// 获取用户收藏的文章列表
exports.getUserFavoritesService = async (userId, page = 1, limit = 10) => {
	const result = await getUserFavoritesDao(userId, page, limit);
	console.log(result, "result");
	// 格式化数据
	const rows = result.rows.map((item) => {
		const blogData = item.blog.dataValues;
		// 解析TOC字段
		if (blogData.toc) {
			try {
				blogData.toc = JSON.parse(blogData.toc);
			} catch (e) {
				blogData.toc = [];
			}
		}
		// 添加收藏时间
		blogData.favoriteTime = item.createdAt;
		return blogData;
	});

	return {
		total: result.count,
		rows
	};
};
