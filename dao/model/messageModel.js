const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
// 定义数据模型
// 导出创建的 admin 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"message",
	{
		// 表对应的字段有哪些
		nickname: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		createdAt: true,
		updatedAt: false
	}
);
