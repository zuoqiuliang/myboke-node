const {
	addUserLikeDao,
	deleteUserLikeDao,
	checkUserLikeDao,
	getBlogLikeCountDao,
	getUserLikedBlogsDao
} = require("../dao/userLikeDao");

// 添加点赞
exports.addUserLikeService = async (userId, blogId) => {
	const result = await addUserLikeDao(userId, blogId);
	return result;
};

// 取消点赞
exports.deleteUserLikeService = async (userId, blogId) => {
	const result = await deleteUserLikeDao(userId, blogId);
	return result;
};

// 检查是否已点赞
exports.checkUserLikeService = async (userId, blogId) => {
	const isLiked = await checkUserLikeDao(userId, blogId);
	return { isLiked };
};

// 获取文章点赞数
exports.getBlogLikeCountService = async (blogId) => {
	const likeCount = await getBlogLikeCountDao(blogId);
	return { likeCount };
};

// 获取用户点赞的文章列表
exports.getUserLikedBlogsService = async (userId, page = 1, limit = 10) => {
	const result = await getUserLikedBlogsDao(userId, page, limit);
	
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
		// 添加点赞时间
		blogData.likeTime = item.createdAt;
		return blogData;
	});

	return {
		total: result.count,
		rows
	};
};