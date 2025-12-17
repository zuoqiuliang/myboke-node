const blogTypeModel = require("./model/blogTypeModel");
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
exports.getAllBlogTyoeDao = async () => {
	return await blogTypeModel.findAll();
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
