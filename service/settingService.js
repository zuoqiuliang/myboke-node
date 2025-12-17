const { getAllSettingDao, updateSettingDao } = require("../dao/settingDao");

// 获取全局信息设置
exports.getSettingService = async () => {
	return await getAllSettingDao();
};

// 设置全局信息设置
exports.setSettingService = async (settingInfo) => {
	const data = await updateSettingDao(settingInfo);
	return data;
};
