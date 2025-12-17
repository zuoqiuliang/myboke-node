const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
// 定义数据模型 
// 导出创建的 admin 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"admin",
	{
		// 表对应的字段有哪些
		loginId: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		loginPwd: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		createdAt: false,
		updatedAt: false
	}
);
