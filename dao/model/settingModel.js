const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");
const { v4: uuidv4 } = require("uuid");
// 定义数据模型
// 导出创建的 admin 模型（表），当往表里增加数据的时候会用到该导出的模型
module.exports = sequelize.define(
	"setting",
	{
		// 主键
		id: {
			type: DataTypes.STRING(36),
			unique: true,
			primaryKey: true,
			defaultValue: () => uuidv4()
		},
		// 表对应的字段有哪些
		avatar: {
			type: DataTypes.STRING,
			allowNull: true
		},
		siteTitle: {
			type: DataTypes.STRING,
			allowNull: false
		},
		github: {
			type: DataTypes.STRING,
			allowNull: true
		},
		qq: {
			type: DataTypes.STRING,
			allowNull: false
		},
		qqQrcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		weixin: {
			type: DataTypes.STRING,
			allowNull: false
		},
		weixinQrcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		mail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// 网站备案号
		icp: {
			type: DataTypes.STRING,
			allowNull: true
		},
		githubName: {
			type: DataTypes.STRING,
			allowNull: true
		},
		// 网站图标
		favicon: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		freezeTableName: true,
		createdAt: true,
		updatedAt: false
	}
);
