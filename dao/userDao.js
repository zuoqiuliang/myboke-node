const md5 = require("md5");
const userModel = require("./model/userCModel");
const { v4: uuidv4 } = require("uuid");
// 查找是否注册过该账号
exports.getUserDao = async (phone) => {
	return await userModel.findOne({
		where: {
			phone
		}
	});
};
// 向用户表中注册用户
exports.addUserDao = async (user) => {
	console.log(user, "=======user");
	try {
		const result = await userModel.create({
			phone: user.phone,
			password: md5(user.password)
		});
		console.log("=======addUserDao result:", result);
		return result;
	} catch (error) {
		console.error("=======addUserDao error:", error);
		throw error;
	}
};

// 校验登录用户是否存在
exports.loginUserDao = async (user) => {
	return await userModel.findOne({
		where: {
			phone: user.phone,
			password: md5(user.password)
		}
	});
};
