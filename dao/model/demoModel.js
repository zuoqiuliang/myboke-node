const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
module.exports = sequelize.define(
	"demo",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false
		},
		github: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 描述
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 项目缩略图
		thumb: {
			type: DataTypes.STRING,
			allowNull: false
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		createdAt: true,
		updatedAt: false
	}
);
