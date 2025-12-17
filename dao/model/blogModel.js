const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
// 定义数据模型
module.exports = sequelize.define(
	"blog",
	{
		// 表对应的字段有哪些
		// 文章标题
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 描述
		description: {
			type: DataTypes.STRING,
			allowNull: false
		},
		toc: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		htmlContent: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		thumb: {
			type: DataTypes.STRING,
			allowNull: false
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
