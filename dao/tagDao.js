const tagModel = require("./model/tagModel");

// 添加标签
exports.addTagDao = async (newTagInfo) => {
	return await tagModel.create(newTagInfo);
};

// 获取所有标签
exports.getAllTagDao = async () => {
	return await tagModel.findAll({
		order: [['order', 'ASC']]
	});
};

// 获取标签树结构（用于层级展示）
exports.getTagTreeDao = async () => {
	const allTags = await tagModel.findAll({
		order: [['order', 'ASC']]
	});
	
	// 构建标签树
	const tagMap = new Map();
	const rootTags = [];
	
	// 第一遍：创建标签映射
	for (const tag of allTags) {
		tagMap.set(tag.id, {
			...tag.dataValues,
			children: []
		});
	}
	
	// 第二遍：构建树结构
	for (const tag of allTags) {
		if (!tag.parentId) {
			// 根标签
			rootTags.push(tagMap.get(tag.id));
		} else {
			// 子标签，添加到父标签的 children 数组
			const parent = tagMap.get(tag.parentId);
			if (parent) {
				parent.children.push(tagMap.get(tag.id));
			}
		}
	}
	
	return rootTags;
};

// 获取单个标签
exports.getOneTagDao = async (id) => {
	return await tagModel.findByPk(id);
};

// 更新标签
exports.updateOneTagDao = async (id, newTagInfo) => {
	return await tagModel.update(newTagInfo, {
		where: {
			id
		}
	});
};

// 删除标签
exports.deleteOneTagDao = async (id) => {
	return await tagModel.destroy({
		where: {
			id
		}
	});
};

// 根据父标签 ID 获取子标签
exports.getChildTagsDao = async (parentId) => {
	return await tagModel.findAll({
		where: {
			parentId
		},
		order: [['order', 'ASC']]
	});
};