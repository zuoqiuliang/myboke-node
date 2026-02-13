const md5 = require("md5");
const userInfoModel = require("./model/userInfoModel");
const userCModel = require("./model/userCModel");

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
	// 先查询用户基本信息
	const userInfo = await userInfoModel.findOne({
		where: {
			userId: id
		}
	});

	// 如果找到了用户信息，再查询对应的userC记录获取创建时间
	if (userInfo) {
		const userC = await userCModel.findByPk(id, {
			attributes: ["createdAt"]
		});

		if (userC) {
			// 将创建时间添加到用户信息中
			userInfo.dataValues.createdAt = userC.createdAt;
		}
	}

	return userInfo;
};

// 更新用户信息
exports.updateUserInfoDao = async (userId, userInfoData) => {
	return await userInfoModel.update(userInfoData, {
		where: {
			userId
		}
	});
};
