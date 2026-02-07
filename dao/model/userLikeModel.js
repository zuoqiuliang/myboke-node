const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
const blogModel = require("./blogModel");
const userCModel = require("./userCModel");

// 定义用户点赞模型
const userLikeModel = sequelize.define(
	"userLike",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 用户ID
		userId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 文章ID
		blogId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 点赞时间
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

// 添加与博客模型的关联
userLikeModel.belongsTo(blogModel, {
	foreignKey: "blogId",
	as: "blog"
});

// 添加与用户模型的关联
userLikeModel.belongsTo(userCModel, {
	foreignKey: "userId",
	targetKey: "id",
	as: "user"
});

module.exports = userLikeModel;