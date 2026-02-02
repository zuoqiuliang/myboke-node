const { Op } = require("sequelize");
const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");
const userCModel = require("./model/userCModel");
const userInfoModel = require("./model/userInfoModel");
const tagModel = require("./model/tagModel");
exports.addBlogDao = async (newBlogInfo) => {
	console.log(newBlogInfo, "newBlogInfo");
	// 提取标签ID，避免将tags字段传递给create方法
	const { tags, ...blogData } = newBlogInfo;
	// 创建博客
	const blogIns = await blogModel.create(blogData);
	// 处理标签关联（使用实例方法）
	let blogTags = [];
	if (tags && Array.isArray(tags)) {
		blogTags = await blogIns.setTags(tags);
	}
	return { ...blogIns, tags: blogTags };
};

// 查询文章带分页
exports.getBlogByPageDao = async (searchInfo) => {
	console.log(searchInfo, "searchInfo======>");
	// 添加参数验证
	if (!searchInfo || typeof searchInfo !== "object") {
		searchInfo = {};
	}

	// 设置默认值
	const page = parseInt(searchInfo.page) || 1;
	const limit = parseInt(searchInfo.limit) || 10;

	// 构建查询条件
	let where = {};

	// 标题搜索
	if (searchInfo.title && searchInfo.title.trim()) {
		where.title = {
			[Op.like]: `%${searchInfo.title}%`
		};
	}

	// 描述模糊搜索
	if (searchInfo.description && searchInfo.description.trim()) {
		where.description = {
			[Op.like]: `%${searchInfo.description}%`
		};
	}

	// 标签搜索
	if (searchInfo.tagId && searchInfo.tagId !== "-1") {
		// 标签搜索需要通过关联查询实现
	}

	// 作者搜索
	if (searchInfo.userId && searchInfo.userId !== "-1") {
		where.userId = searchInfo.userId;
	}

	// 时间范围搜索
	if (searchInfo.startTime && searchInfo.endTime) {
		where.createdAt = {
			[Op.between]: [new Date(searchInfo.startTime), new Date(searchInfo.endTime)]
		};
	} else if (searchInfo.startTime) {
		where.createdAt = {
			[Op.gte]: new Date(searchInfo.startTime)
		};
	} else if (searchInfo.endTime) {
		where.createdAt = {
			[Op.lte]: new Date(searchInfo.endTime)
		};
	}

	// 根据分类进行分页查询
	if (searchInfo.categoryId && searchInfo.categoryId !== "-1") {
		// 根据分页，查询文章表里指定分类下的文章
		const data = await blogModel.findAndCountAll({
			where: where,
			include: [
				{
					model: blogTypeModel,
					as: "category", //返回数据的时候给起别名
					where: {
						id: searchInfo.categoryId
					}
				},
				{
					model: userInfoModel,
					as: "userInfo"
				},
				{
					model: tagModel,
					as: "tags" // 返回文章的标签
				}
			],
			offset: (page - 1) * limit,
			limit: limit,
			order: [["createdAt", "DESC"]]
		});
		return data;
	} else {
		// 根据分页，查询文章表里所有文章
		const data = await blogModel.findAndCountAll({
			where: where,
			include: [
				{
					model: blogTypeModel,
					as: "category" //返回数据的时候给起别名
				},
				{
					model: userInfoModel,
					as: "userInfo"
				},
				{
					model: tagModel,
					as: "tags" // 返回文章的标签
				}
			],
			offset: (page - 1) * limit,
			limit: limit,
			order: [["createdAt", "DESC"]]
		});
		return data;
	}
};

// 获取一个博客文章
exports.getOneBlogDao = async (id) => {
	const data = await blogModel.findByPk(id, {
		include: [
			{
				model: blogTypeModel,
				as: "category" //返回数据的时候给关联的表起别名
			},
			{
				model: userInfoModel,
				as: "userInfo"
			},
			{
				model: tagModel,
				as: "tags" // 返回文章的标签
			}
		]
	});
	console.log(data);
	return data;
};

//修改一个博客文章
exports.updateOneBlogDao = async (id, newBlogInfo) => {
	// 提取标签ID，避免将tags字段传递给update方法
	const { tags, ...blogData } = newBlogInfo;
	// 更新博客信息
	const result = await blogModel.update(blogData, {
		where: {
			id
		}
	});
	// 处理标签关联（使用实例方法）
	if (tags !== undefined) {
		const blogIns = await blogModel.findByPk(id);
		await blogIns.setTags(tags);
	}
	return result;
};

// 删除一个博客文章
exports.deleteOneBlogDao = async (id) => {
	console.log(id, "id");

	return await blogModel.destroy({
		where: {
			id
		}
	});
};

//获取某分类下所有文章数量
exports.getAllBlogByCategoryIdDao = async (categoryId) => {
	return await blogModel.count({
		where: {
			categoryId
		}
	});
};
