const settingModel = require("./model/settingModel");
// 获取全局设置
exports.getAllSettingDao = async () => {
	return await settingModel.findAll();
};

// 修改全局设置
exports.updateSettingDao = async (settingInfo) => {
	await settingModel.update(settingInfo, {
		where: {
			id: 1
		}
	});
	return await settingModel.findAll();
};
