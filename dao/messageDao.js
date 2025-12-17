const { Op } = require("sequelize");
const messageModel = require("./model/messageModel");
const blogModel = require("./model/blogModel");

exports.addMessageDao = async (messageInfo) => {
	return await messageModel.create(messageInfo);
};

// 分页获取评论数
exports.getAllMessageDao = async (searchInfo) => {
	console.log(searchInfo, "searchInfo");
	if (searchInfo.blogId) {
		// 有 blogId 说明是评论，在 B 端有一个评论管理模块，获取所有评论，而在 C 端需要在某一篇文章下获取评论，所以分为两种情况
		// 通过一个类型值来做判断是否全部获取，all 为全部获取，确定的 blogId 则只获取其中一篇的
		if (searchInfo.blogId == "all") {
			const data = await messageModel.findAndCountAll({
				where: {
					blogId: {
						[Op.ne]: null
					}
				},
				include: [
					{
						model: blogModel,
						as: "blog"
					}
				],
				offset: (searchInfo.page * 1 - 1) * searchInfo.limit, //跳过多少条
				limit: searchInfo.limit * 1,
				order: [["createdAt", "DESC"]]
			});
			return data;
		} else {
			return await messageModel.findAndCountAll({
				where: {
					blogId: searchInfo.blogId
				},
				offset: (searchInfo.page * 1 - 1) * searchInfo.limit, //跳过多少条
				limit: searchInfo.limit * 1,
				order: [["createdAt", "DESC"]]
			});
		}
	} else {
		return await messageModel.findAndCountAll({
			where: {
				blogId: null
			},
			offset: (searchInfo.page * 1 - 1) * searchInfo.limit, //跳过多少条
			limit: searchInfo.limit * 1,
			order: [["createdAt", "DESC"]]
		});
	}
};

// 删除评论(通过留言/评论表的主键 id 删除)
exports.deleteMessageDao = async (id) => {
	return await messageModel.destroy({
		where: {
			id
		}
	});
};

// 删除评论（通过文章的 id 来删除文章下所有评论）
exports.deleteMessageByBlogIdDao = async (blogId) => {
	return await messageModel.destroy({
		where: {
			blogId
		}
	});
};
