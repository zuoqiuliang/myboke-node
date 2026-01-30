const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");

// 定义标签模型
module.exports = sequelize.define(
	"tag",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 标签名称
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 父标签 ID（用于实现层级结构）
		parentId: {
			type: DataTypes.STRING(36),
			allowNull: true // 顶级标签的 parentId 为 null
		},
		// 标签排序
		order: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		}
	},
	{
		freezeTableName: true,
		createdAt: false,
		updatedAt: false
	}
);
