const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
const blogModel = require("./blogModel");
const userCModel = require("./userCModel");
// 定义用户收藏模型
const userFavoriteModel = sequelize.define(
	"userFavorite",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 用户ID（关联userInfo表）
		userId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 文章ID（关联blog表）
		blogId: {
			type: DataTypes.STRING(36),
			allowNull: false
		},
		// 收藏时间
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
userFavoriteModel.belongsTo(blogModel, {
	foreignKey: "blogId",
	as: "blog"
});

// 添加与用户模型的关联
userFavoriteModel.belongsTo(userCModel, {
	foreignKey: "userId",
	targetKey: "id", // 关联到 userCModel 的 id 字段
	as: "user"
});

module.exports = userFavoriteModel;
