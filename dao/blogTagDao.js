const blogTagModel = require("./model/blogTagModel");
const tagModel = require("./model/tagModel");

// 添加文章标签关联
exports.addBlogTagDao = async (blogId, tagIds) => {
	// 先删除该文章的所有现有标签关联
	await blogTagModel.destroy({
		where: {
			blogId
		}
	});
	
	// 添加新的标签关联
	if (tagIds && tagIds.length > 0) {
		const blogTagData = tagIds.map(tagId => ({
			blogId,
			tagId
		}));
		return await blogTagModel.bulkCreate(blogTagData);
	}
	
	return [];
};

// 获取文章的所有标签
exports.getBlogTagsDao = async (blogId) => {
	return await blogTagModel.findAll({
		where: {
			blogId
		},
		include: [
			{
				model: tagModel,
				as: "tag"
			}
		]
	});
};

// 删除文章的标签关联
exports.deleteBlogTagsDao = async (blogId) => {
	return await blogTagModel.destroy({
		where: {
			blogId
		}
	});
};

// 根据标签获取文章数量
exports.getBlogCountByTagDao = async (tagId) => {
	return await blogTagModel.count({
		where: {
			tagId
		}
	});
};

// 根据标签 ID 获取文章列表
exports.getBlogsByTagDao = async (tagId, offset = 0, limit = 10) => {
	return await blogTagModel.findAll({
		where: {
			tagId
		},
		offset,
		limit
	});
};