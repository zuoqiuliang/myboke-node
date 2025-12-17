const bannerModel = require("./model/bannerModel");

exports.findBannerDao = async () => {
	return await bannerModel.findAll();
};

exports.updateBannerDao = async (bannerArr) => {
	await bannerModel.destroy({
		truncate: true // 将表的数据全部删除
	});
	// 批量创建
	await bannerModel.bulkCreate(bannerArr);
	return await bannerModel.findAll();
};
