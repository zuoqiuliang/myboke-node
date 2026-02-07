const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义评论模型
const messageModel = sequelize.define(
	"message",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 用户ID（关联userC表）
		userId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 文章ID（关联blog表）
		blogId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 评论内容
		content: {
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

module.exports = messageModel;
