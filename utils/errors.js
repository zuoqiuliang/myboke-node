// 自定义错误  ,当错误发生的时候，捕获到并且使用本文件自定义的错误
const { formatResponse } = require("./tool");
/**
 * 业务处理错误基类
 */
class ServiceError extends Error {
	/**
	 *
	 * @param {*} message 错误消息提示
	 * @param {*} code 错误消息码
	 */
	constructor(message, code) {
		super(message);
		this.code = code;
	}

	toResponseJSON() {
		return formatResponse(this.code, this.message, null);
	}
}

// 文件上传错误
exports.UploadError = class extends ServiceError {
	constructor(message) {
		// 文件上传的错误状态码是413
		super(message, 413);
	}
};

//禁止访问错误
exports.ForbiddenError = class extends ServiceError {
	constructor(message) {
		super(message, 401);
	}
};

// 验证错误
exports.ValidationError = class extends ServiceError {
	constructor(message) {
		super(message, 406);
	}
};

//无资源错误
exports.NotFoundError = class extends ServiceError {
	constructor(message) {
		super("无资源 not found", 404);
	}
};

//未知错误
exports.UnknownError = class extends ServiceError {
	constructor(message) {
		super("server internal error", 500);
	}
};

module.exports.ServiceError = ServiceError;
