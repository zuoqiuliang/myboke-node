const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const randomName = require("random-name");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
// 导出创建的 userInfo 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"userInfo",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		userName: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: randomName()
		},
		// 职业方向
		careerDirection: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 个人介绍
		selfIntroduction: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 头像
		avatar: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 邮箱
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 电话
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 所在地
		location: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 外键
		userId: {
			type: DataTypes.STRING(36),
			allowNull: false
		}
	},
	{
		freezeTableName: true,
		createdAt: false,
		updatedAt: false
	}
);
