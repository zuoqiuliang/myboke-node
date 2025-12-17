const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");
exports.addBlogDao = async (newBlogInfo) => {
	console.log(newBlogInfo, "newBlogInfo");
	return await blogModel.create(newBlogInfo);
};

// 查询文章带分页
exports.getBlogByPageDao = async (searchInfo) => {
	// 根据分类进行分页查询
	if (searchInfo.categoryId && searchInfo.categoryId !== "-1") {
		// 根据分页，查询文章表里指定分类下的文章
		const data = await blogModel.findAndCountAll({
			include: [
				{
					model: blogTypeModel,
					as: "category", //返回数据的时候给起别名
					where: {
						id: searchInfo.categoryId
					}
				}
			],

			offset: (searchInfo.page * 1 - 1) * searchInfo.limit, //跳过多少条
			limit: searchInfo.limit * 1
		});
		return data;
	} else {
		// 根据分页，查询文章表里所有文章
		const data = await blogModel.findAndCountAll({
			include: [
				{
					model: blogTypeModel,
					as: "category" //返回数据的时候给起别名
				}
			],
			offset: (searchInfo.page * 1 - 1) * searchInfo.limit, //跳过多少条
			limit: searchInfo.limit * 1
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
			}
		]
	});
	console.log(data);
	return data;
};

//修改一个博客文章
exports.updateOneBlogDao = async (id, newBlogInfo) => {
	return await blogModel.update(newBlogInfo, {
		where: {
			id
		}
	});
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
