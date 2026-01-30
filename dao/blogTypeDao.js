const blogTypeModel = require("./model/blogTypeModel");
const { Op } = require("sequelize");
exports.addBlogTypeDao = async (newBlogTypeInfo) => {
	return await blogTypeModel.create(newBlogTypeInfo);
};

// 根据分类 Id新增对应的博客数量
exports.addBlogTypeArcticleCount = async (id) => {
	const data = await blogTypeModel.findByPk(id);
	// 方法一：
	// data.arcticleCount++;
	// await data.asve()
	// 方法二：
	await blogTypeModel.update(
		{ arcticleCount: data.arcticleCount + 1 },
		{
			where: {
				id
			}
		}
	);
	return "1"; //1 代表更新成功
};
exports.getAllBlogTyoeDao = async (searchInfo) => {
	console.log(searchInfo, "searchInfo");
	// 添加参数验证
	if (!searchInfo || typeof searchInfo !== "object") {
		searchInfo = {};
	}
	// 设置默认值
	const page = parseInt(searchInfo.page) || 1;
	const limit = parseInt(searchInfo.limit) || 10;
	const orderBy = searchInfo.order || "order";

	let where = {};

	// 定义表中存在的字段列表
	const validFields = ["id", "name", "arcticleCount", "path", "order", "createdAt"];

	// 构建搜索条件
	for (let key in searchInfo) {
		// 只处理表中存在的字段，并且排除分页和排序相关参数
		if (searchInfo[key] && validFields.includes(key)) {
			// 支持模糊搜索
			if (key === "name" || key === "path") {
				where[key] = {
					[Op.like]: `%${searchInfo[key]}%`
				};
			} else {
				where[key] = searchInfo[key];
			}
		}
	}
	// 确保排序字段是有效的
	const validOrderFields = ["id", "name", "arcticleCount", "order", "createdAt"];
	const finalOrderBy = validOrderFields.includes(orderBy) ? orderBy : "order";

	// 计算偏移量
	const offset = (page - 1) * limit;

	return await blogTypeModel.findAndCountAll({
		where: where,
		offset: offset, // 跳过多少条
		limit: limit, // 限制返回数量
		order: [[finalOrderBy]], // 排序
		attributes: ["id", "name", "arcticleCount", "path", "order", "createdAt"] // 指定返回字段
	});
};

// 获取一个博客分类
exports.getOneBlogTypeDao = async (id) => {
	const data = await blogTypeModel.findByPk(id);
	return data;
};

//修改一个博客分类
exports.updateOneBlogTypeDao = async (id, newBlogTypeInfo) => {
	return await blogTypeModel.update(newBlogTypeInfo, {
		where: {
			id
		}
	});
};

// 删除一个博客分类
exports.deleteOneBlogTypeDao = async (id) => {
	return await blogTypeModel.destroy({
		where: {
			id
		}
	});
};
