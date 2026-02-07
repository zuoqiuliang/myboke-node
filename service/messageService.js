const {
	addMessageDao,
	deleteMessageDao,
	getMessagesByBlogIdDao,
	getMessageCountByBlogIdDao,
	getAllMessagesDao
} = require("../dao/messageDao");

// 添加评论
exports.addMessageService = async (userId, blogId, content) => {
	// 验证参数
	if (!content || content.trim() === "") {
		return { success: false, message: "评论内容不能为空" };
	}

	const result = await addMessageDao(userId, blogId, content.trim());
	return result;
};

// 删除评论
exports.deleteMessageService = async (messageId, userId) => {
	const result = await deleteMessageDao(messageId, userId);
	return result;
};

// 根据文章ID获取评论列表
exports.getMessagesByBlogIdService = async (blogId, page = 1, limit = 20) => {
	const result = await getMessagesByBlogIdDao(blogId, page, limit);

	// 格式化数据
	const rows = result.rows.map((message) => {
		const messageData = message.dataValues;
		// 提取用户信息
		if (messageData.user && messageData.user.userInfo) {
			messageData.userInfo = messageData.user.userInfo.dataValues;
			delete messageData.user;
		}
		return messageData;
	});

	return {
		total: result.count,
		rows
	};
};

// 获取文章的评论数
exports.getMessageCountByBlogIdService = async (blogId) => {
	const count = await getMessageCountByBlogIdDao(blogId);
	return { count };
};

// 获取所有用户评论（带分页）
exports.getAllMessagesService = async (page = 1, limit = 20) => {
	const result = await getAllMessagesDao(page, limit);

	// 格式化数据
	const rows = result.rows.map((message) => {
		const messageData = message.dataValues;
		// 提取用户信息
		if (messageData.user && messageData.user.userInfo) {
			messageData.userInfo = messageData.user.userInfo.dataValues;
			delete messageData.user;
		}
		// 提取文章信息
		if (messageData.blog) {
			messageData.blogInfo = {
				id: messageData.blog.id,
				title: messageData.blog.title,
				category: messageData.blog.category ? messageData.blog.category.name : null
			};
			delete messageData.blog;
		}
		return messageData;
	});

	return {
		total: result.count,
		rows
	};
};
