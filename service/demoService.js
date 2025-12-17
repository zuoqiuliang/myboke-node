const { validate } = require("validate.js");
const { ValidationError } = require("../utils/errors");
const {
	getAllDemoDao,
	addDemoDao,
	getOneDemoDao,
	updateOneDemoDao,
	deleteOneDemoDao
} = require("../dao/demoDao");

// 新增项目
exports.addDemoService = async (newDemoInfo) => {
	// 新增的时候需要验证，比如：用户通过 postman 发送的请求而不是通过真实web 端项目发送的，使用validate.js来做验证
	// 由于description传递的是数组，所以把description转成字符串
	newDemoInfo.description = JSON.stringify(newDemoInfo.description);
	/**
	 * 数据验证规则
	 */
	const DemoRule = {
		name: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		url: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		github: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		},
		order: {
			presence: {
				allowEmpty: false
			},
			type: "integer"
		},
		description: {
			presence: {
				allowEmpty: false
			},
			type: "string"
		}
	};
	/**
	 *进行数据验证,validate.validate方法验证成功会返回 undefined
	 */
	const validateResult = validate.validate(newDemoInfo, DemoRule);
	console.log(validateResult, "l");
	if (!validateResult) {
		const { dataValues } = await addDemoDao(newDemoInfo);
		console.log(dataValues);
		return dataValues;
	} else {
		throw new ValidationError("数据验证失败");
	}
};

// 获取项目
exports.getAllDemoService = async () => {
	const data = await getAllDemoDao();
	data.forEach((item, index) => {
		item.dataValues.description = JSON.parse(item.dataValues.description);
	});
	console.log(data);
	return data;
};

// 获取一个项目
exports.getOneDemoService = async (id) => {
	const data = await getOneDemoDao(id);
	data.description = JSON.parse(data.description);
	return data;
};

//修改一个项目
exports.updateOneDemoService = async (id, newDemoInfo) => {
	console.log(id, newDemoInfo);
	if (newDemoInfo.description) {
		newDemoInfo.description = JSON.stringify(newDemoInfo.description);
	}
	const result = await updateOneDemoDao(id, newDemoInfo);
	console.log(result);
	if (result[0] === 1) {
		const data = await getOneDemoDao(id);
		data.description = JSON.parse(data.description);
		return data;
	}
};

// 删除一个项目
exports.deleteOneDemoService = async (id) => {
	return await deleteOneDemoDao(id);
};
