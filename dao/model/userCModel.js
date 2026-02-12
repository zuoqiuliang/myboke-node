const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
// 导出创建的 userC 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"userC",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		phone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 创建时间字段
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		},
		// 更新时间字段
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		timestamps: true
	}
);
