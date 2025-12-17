const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");

// 获取首页标语
exports.getBannerService = async () => {
	return await findBannerDao();
};

// 设置首页标语
exports.setBannerService = async (bannerArr) => {
	const data = await updateBannerDao(bannerArr);
	return data;
};
