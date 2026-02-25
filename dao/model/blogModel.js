const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
module.exports = sequelize.define(
	"blog",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		// 文章标题
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 描述
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		toc: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		htmlContent: {
			type: DataTypes.TEXT("long"),
			allowNull: false
		},
		markdownContent: {
			type: DataTypes.TEXT("long"),
			allowNull: false
		},
		thumb: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 文章浏览数
		scanNumber: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		// 文章评论数
		commentNumber: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		categoryId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		userId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		}
	},
	{
		freezeTableName: true,
		updatedAt: false
	}
);
