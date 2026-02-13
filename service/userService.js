const { getUserDao, addUserDao, loginUserDao } = require("../dao/userDao");
const validate = require("validate.js");
const { ValidationError } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const {
	addUserInfoDao,
	getUserInfoDao,
	updateUserInfoDao
} = require("../dao/userInfoDao");
const { getBlogsByUserIdDao } = require("../dao/blogDao");
const userFollowDao = require("../dao/userFollowDao");
const { getUserArticlesLikeCountDao } = require("../dao/userLikeDao");
const { v4: uuidv4 } = require("uuid");
exports.registerUserService = async (user) => {
	try {
		// 校验注册的账号是否填写
		const validateResult = validate(user, {
			phone: {
				presence: {
					allowEmpty: false
				},
				type: "string"
			},
			password: {
				presence: {
					allowEmpty: false
				},
				type: "string"
			},
			// 确认密码
			confirmPassword: {
				presence: {
					allowEmpty: false
				},
				type: "string",
				equality: "password"
			}
		});
		if (validateResult) {
			throw new ValidationError("注册信息验证失败: " + JSON.stringify(validateResult));
		}
	} catch (error) {
		console.log(error);
		throw new ValidationError("注册账号或密码不能为空");
	}
	// 先检查该用户是否注册过
	const userInfo = await getUserDao(user.phone);
	if (userInfo) {
		throw new ValidationError("该用户已注册");
	}
	// 注册用户，不传递id，让模型自动生成
	const result = await addUserDao(user);
	console.log(result);
	return {
		phone: result.phone
	};
};
// 登录
exports.loginUserService = async (user) => {
	try {
		// 校验登录的账号是否填写
		const validateResult = validate(user, {
			phone: {
				presence: {
					allowEmpty: false
				},
				type: "string"
			},
			password: {
				presence: {
					allowEmpty: false
				},
				type: "string"
			}
		});
		console.log(validateResult, "=======validateResult");
		if (validateResult) {
			throw new ValidationError("登录信息验证失败: " + JSON.stringify(validateResult));
		}
	} catch (error) {
		console.log(error);
		throw new ValidationError("登录账号或密码不能为空");
	}
	// 校验登录用户是否存在
	const result = await loginUserDao(user);
	console.log(result, "=======result");
	if (!result) {
		throw new ValidationError("登录账号或密码错误");
	}
	let userInfo = result.dataValues;
	// 用户存在，检查用户信息表里是否有该用户的信息，没有则创建，有则返回用户信息
	let userInfoData = await getUserInfoDao(userInfo.id);
	if (!userInfoData) {
		// 如果用户信息表里没有该用户的信息，则创建
		userInfoData = await addUserInfoDao({ userId: userInfo.id });
	}
	console.log(userInfoData, "=======userInfoData");
	let loginPeriod = null;
	if (user.remember) {
		//如果用户勾选了记住密码则 cookie 的 token 时长为 7 天
		loginPeriod = 7;
	} else {
		loginPeriod = 1;
	}
	const token = jwt.sign(
		// 参数一：使用哪些属性作为生成 token 的属性
		{
			id: userInfo.id,
			phone: userInfo.phone
		},
		// 参数二：密钥，使用 .env 文件的环境变量JWT_SECRET
		md5(process.env.JWT_SECRET),
		// 参数三： token时长
		{
			expiresIn: 60 * 60 * 24 * loginPeriod
		}
	);
	console.log(token, "=======token");
	return {
		token,
		phone: userInfo.phone,
		id: userInfo.id,
		remember: loginPeriod,
		userName: userInfoData.userName
	};
};

// 查询用户信息（默认查询当前登录用户）
exports.getUserInfoService = async (userId) => {
	const userInfo = await getUserInfoDao(userId);
	if (!userInfo) {
		throw new ValidationError("用户信息不存在");
	}

	// 获取用户的文章数
	const blogsResult = await getBlogsByUserIdDao(userId, 1, 1);
	const articleCount = blogsResult.count;

	// 获取用户的关注人数
	const followingCount = await userFollowDao.getFollowingCount(userId);

	// 获取用户的粉丝数
	const followerCount = await userFollowDao.getFollowersCount(userId);

	// 获取用户所有文章的被点赞总数
	const totalArticlesLikeCount = await getUserArticlesLikeCountDao(userId);

	// 将统计信息添加到用户信息中
	const userInfoWithStats = {
		...userInfo.dataValues,
		articleCount,
		followingCount,
		followerCount,
		totalArticlesLikeCount
	};

	return userInfoWithStats;
};

// 通过用户ID查询用户信息
exports.getUserInfoByIdService = async (userId) => {
	const userInfo = await getUserInfoDao(userId);
	if (!userInfo) {
		throw new ValidationError("用户信息不存在");
	}

	// 获取用户的文章数
	const blogsResult = await getBlogsByUserIdDao(userId, 1, 1);
	const articleCount = blogsResult.count;

	// 获取用户的关注人数
	const followingCount = await userFollowDao.getFollowingCount(userId);

	// 获取用户的粉丝数
	const followerCount = await userFollowDao.getFollowersCount(userId);

	// 获取用户所有文章的被点赞总数
	const totalArticlesLikeCount = await getUserArticlesLikeCountDao(userId);

	// 将统计信息添加到用户信息中
	const userInfoWithStats = {
		...userInfo.dataValues,
		articleCount,
		followingCount,
		followerCount,
		totalArticlesLikeCount
	};

	return userInfoWithStats;
};

// 更新用户信息
exports.updateUserInfoService = async (userId, userInfoData) => {
	// 验证用户信息是否存在
	const existingUserInfo = await getUserInfoDao(userId);
	if (!existingUserInfo) {
		throw new ValidationError("用户信息不存在");
	}

	// 更新用户信息
	await updateUserInfoDao(userId, userInfoData);

	// 返回更新后的用户信息
	return await getUserInfoDao(userId);
};
