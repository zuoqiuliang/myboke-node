const messageModel = require("./model/messageModel");
const userCModel = require("./model/userCModel");
const blogModel = require("./model/blogModel");
const userInfoModel = require("./model/userInfoModel");
const blogTypeModel = require("./model/blogTypeModel");

// 添加评论
exports.addMessageDao = async (userId, blogId, content) => {
	// 验证外键存在性
	const blogExists = await blogModel.findByPk(blogId);
	if (!blogExists) {
		return { success: false, message: "文章不存在" };
	}

	const userExists = await userCModel.findByPk(userId);
	if (!userExists) {
		return { success: false, message: "用户不存在" };
	}

	// 创建评论
	const result = await messageModel.create({
		userId,
		blogId,
		content
	});

	// 更新文章的评论数
	blogExists.commentNumber++;
	await blogExists.save();

	return { success: true, data: result };
};

// 删除评论
exports.deleteMessageDao = async (messageId, userId) => {
	// 检查评论是否存在且属于当前用户
	const message = await messageModel.findOne({
		where: {
			id: messageId,
			userId
		}
	});

	if (!message) {
		return { success: false, message: "评论不存在或无权限删除" };
	}

	// 保存文章ID用于后续更新评论数
	const blogId = message.blogId;

	// 删除评论
	const deletedCount = await messageModel.destroy({
		where: {
			id: messageId,
			userId
		}
	});

	// 更新文章的评论数
	const blog = await blogModel.findByPk(blogId);
	if (blog && blog.commentNumber > 0) {
		blog.commentNumber--;
		await blog.save();
	}

	return { success: true, deleted: deletedCount };
};

// 根据文章ID获取评论列表
exports.getMessagesByBlogIdDao = async (blogId, page = 1, limit = 20) => {
	const offset = (page - 1) * limit;

	return await messageModel.findAndCountAll({
		where: {
			blogId
		},
		include: [
			{
				model: userCModel,
				as: "user",
				include: [
					{
						model: userInfoModel,
						as: "userInfo"
					}
				]
			}
		],
		offset,
		limit,
		order: [["createdAt", "DESC"]] // 按时间降序，最新的在最上边
	});
};

// 获取文章的评论数
exports.getMessageCountByBlogIdDao = async (blogId) => {
	const count = await messageModel.count({
		where: {
			blogId
		}
	});

	return count;
};

// 根据评论ID获取评论详情
exports.getMessageByIdDao = async (messageId) => {
	return await messageModel.findByPk(messageId, {
		include: [
			{
				model: userCModel,
				as: "user",
				include: [
					{
						model: userInfoModel,
						as: "userInfo"
					}
				]
			}
		]
	});
};

// 删除文章的所有评论（用于删除文章时）
exports.deleteMessageByBlogIdDao = async (blogId) => {
	return await messageModel.destroy({
		where: {
			blogId
		}
	});
};

// 获取所有用户评论（带分页）
exports.getAllMessagesDao = async (page = 1, limit = 20) => {
	const offset = (page - 1) * limit;

	return await messageModel.findAndCountAll({
		include: [
			{
				model: userCModel,
				as: "user",
				include: [
					{
						model: userInfoModel,
						as: "userInfo"
					}
				]
			},
			{
				model: blogModel,
				as: "blog",
				include: [
					{
						model: blogTypeModel,
						as: "category"
					}
				]
			}
		],
		offset,
		limit,
		order: [["createdAt", "DESC"]] // 按时间降序，最新的在最上边
	});
};
