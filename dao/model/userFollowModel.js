const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");

// 定义关注关系模型
const UserFollow = sequelize.define(
	"UserFollow",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 关注者ID（主动关注的用户）
		followerId: {
			type: DataTypes.STRING(36),
			allowNull: false,
			references: {
				model: "userC",
				key: "id"
			}
		},
		// 被关注者ID（被关注的用户）
		followingId: {
			type: DataTypes.STRING(36),
			allowNull: false,
			references: {
				model: "userC",
				key: "id"
			}
		},
		// 创建时间
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		},
		// 更新时间
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		tableName: "user_follows",
		timestamps: true,
		indexes: [
			{
				unique: true,
				fields: ["followerId", "followingId"],
				name: "unique_follow"
			},
			{
				fields: ["followerId"],
				name: "idx_follower"
			},
			{
				fields: ["followingId"],
				name: "idx_following"
			}
		]
	}
);

module.exports = UserFollow;