const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
module.exports = sequelize.define(
	"blogType",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		// 分类名
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 文章数
		arcticleCount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		order: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		createdAt: false,
		updatedAt: false
	}
);
