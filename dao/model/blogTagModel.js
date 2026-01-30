const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");

// 定义文章-标签关联表模型
module.exports = sequelize.define(
	"blogTag",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 文章 ID（外键）
		blogId: {
			type: DataTypes.STRING(36),
			allowNull: false,
			references: {
				model: "blog", // 引用的模型名
				key: "id" // 引用的字段
			}
		},
		// 标签 ID（外键）
		tagId: {
			type: DataTypes.STRING(36),
			allowNull: false,
			references: {
				model: "tag", // 引用的模型名
				key: "id" // 引用的字段
			}
		}
	},
	{
		freezeTableName: true,
		createdAt: false,
		updatedAt: false
	}
);
