// 该dao 文件夹下的 Dao 结尾的文件负责和数据库打交道
const adminModel = require("./model/adminModel");
exports.loginDao = async (loginId, loginPwd) => {
	return await adminModel.findOne({
		where: {
			loginId: loginId,
			loginPwd: loginPwd
		}
	});
};

exports.updateAdmin = async (newAccountInfo) => {
	return await adminModel.update(newAccountInfo, {
		where: {
			loginId: newAccountInfo.loginId
		}
	});
};

// 校验管理员是否存在
exports.checkAdminExistDao = async (adminId) => {
	return await adminModel.findOne({
		where: {
			id: adminId
		}
	});
};
