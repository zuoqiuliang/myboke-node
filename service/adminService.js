// admin模型的业务逻辑
const md5 = require("md5");
const { loginDao, updateAdmin } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("../utils/errors");
const { formatResponse, analysisToken } = require("../utils/tool");

exports.loginService = async (loginObj) => {
	console.log(loginObj, "登录信息");
	const { loginPwd, loginId } = loginObj;
	const loginPwdMd5 = md5(loginPwd);
	let result = await loginDao(loginId, loginPwdMd5);
	console.log(result, "result 查到的结果");
	if (result && result.dataValues) {
		// 做 token 的处理
		result = result.dataValues;
		delete result.loginPwd;
		let loginPeriod = null;
		if (loginObj.remember) {
			//如果用户勾选了记住密码则 cookie 的 token 时长为 7 天
			loginPeriod = parseInt(loginObj.remember);
		} else {
			loginPeriod = 1;
		}
		const token = jwt.sign(
			// 参数一：使用哪些属性作为生成 token 的属性
			{
				id: result.id,
				loginId: result.loginId,
				name: result.name
			},
			// 参数二：密钥，使用 .env 文件的环境变量JWT_SECRET
			md5(process.env.JWT_SECRET),
			// 参数三： token时长
			{
				expiresIn: 60 * 60 * 24 * loginPeriod
			}
		);
		console.log("token===>", token);
		return {
			data: result,
			token
		};
	}
	return {
		data: result
	};
};

// 更新管理员账号信息 如：name
exports.updateAdminAccountInfo = async (accountInfo) => {
	console.log(accountInfo);
	if (accountInfo.oldLoginPwd === accountInfo.loginPwd) {
		throw new ValidationError("新密码不能与旧密码重复");
	}
	const adminInfo = await loginDao(
		accountInfo.loginId,
		md5(accountInfo.oldLoginPwd)
	);
	console.log(adminInfo, "admininfo===");
	if (adminInfo && adminInfo.dataValues) {
		const loginPwd = md5(accountInfo.loginPwd);
		console.log(loginPwd);
		const result = await updateAdmin({
			name: accountInfo.name,
			loginId: accountInfo.loginId,
			loginPwd: loginPwd
		});
		return formatResponse(200, "success", {
			id: adminInfo.dataValues.id,
			name: accountInfo.name,
			loginId: accountInfo.loginId
		});
	} else {
		throw new ValidationError("旧密码不正确");
	}
};
