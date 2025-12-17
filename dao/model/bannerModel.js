const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
// 定义数据模型
// 导出创建的 banner 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"banner",
	{
		// 表对应的字段有哪些
		midImg: {
			type: DataTypes.STRING,
			allowNull: false
		},
		bigImg: {
			type: DataTypes.STRING,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
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
