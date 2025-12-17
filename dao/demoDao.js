const demoModel = require("./model/demoModel");

exports.getAllDemoDao = async () => {
	return await demoModel.findAll();
};

// 新增项目
exports.addDemoDao = async (newDemoInfo) => {
	return await demoModel.create(newDemoInfo);
};

//获取一个项目
exports.getOneDemoDao = async (id) => {
	return await demoModel.findByPk(id);
};

// 修改一个项目
exports.updateOneDemoDao = async (id, editInfo) => {
	return await demoModel.update(editInfo, {
		where: {
			id: id
		}
	});
};

// 删除一个项目
exports.deleteOneDemoDao = async (id) => {
	return await demoModel.destroy({
		where: {
			id
		}
	});
};
