const md5 = require("md5");
const userInfoModel = require("./model/userInfoModel");

// 创建用户信息
exports.addUserInfoDao = async (userInfo) => {
	console.log(userInfo, "=======userInfo");
	try {
		const result = await userInfoModel.create(userInfo);
		console.log("=======addUserInfoDao result:", result);
		return result;
	} catch (error) {
		console.error("=======addUserInfoDao error:", error);
		throw error;
	}
};

// 通过用户表id查找用户信息
exports.getUserInfoDao = async (id) => {
	return await userInfoModel.findOne({
		where: {
			userId: id
		}
	});
};
