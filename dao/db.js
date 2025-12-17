// 该文件负责对数据库初始化
const sequelize = require("./dbConnect");
// 引入所有模型之后  一起同步
const adminModel = require("./model/adminModel");
const bannerModel = require("./model/bannerModel");
const blogModel = require("./model/blogModel");
const blogTypeModel = require("./model/blogTypeModel");
const demoModel = require("./model/demoModel");
const messageModel = require("./model/messageModel");
const settingModel = require("./model/settingModel");

const md5 = require("md5");
(async function () {
	/**
	 * 定义播客分类表和博客表之间的关联
	 */
	blogTypeModel.hasMany(blogModel, {
		foreignKey: "categoryId",
		targetKey: "id"
	});
	blogModel.belongsTo(blogTypeModel, {
		foreignKey: "categoryId",
		targetKey: "id",
		as: "category"
	});
	/**
	 * 定义文章表和评论表关联
	 */
	blogModel.hasMany(messageModel, {
		foreignKey: "blogId",
		targetKey: "id"
	});
	messageModel.belongsTo(blogModel, {
		foreignKey: "blogId",
		targetKey: "id",
		as: "blog"
	});
	/**
   * 一次同步所有模型
    你可以使用 sequelize.sync() 自动同步所有模型. 示例：
    await sequelize.sync({ force: true });
    console.log("所有模型均已成功同步.");
   */
	await sequelize.sync({ alter: true });
	console.log("所有模型均已成功同步");
	const adminCount = await adminModel.count();
	console.log("admin表条数：", adminCount);
	if (!adminCount) {
		await adminModel.create({
			loginId: "admin",
			name: "超级管理员",
			loginPwd: md5("123456")
		});
	}
	const bannerCount = await bannerModel.count();
	console.log("banner表条数：", bannerCount);
	if (!bannerCount) {
		await bannerModel.bulkCreate([
			{
				midImg: "/static/images/a.png",
				bigImg: "/static/images/b.png",
				title: "数码宝贝",
				description: "这图是描述数码宝贝的"
			},
			{
				midImg: "/static/images/bada.png",
				bigImg: "/static/images/b.png",
				title: "巴达兽",
				description: "这图是描述数码宝贝的"
			},
			{
				midImg: "/static/images/cat.png",
				bigImg: "/static/images/b.png",
				title: "猫",
				description: "这图是描述数码宝贝的"
			}
		]);
		console.log("初始化首页标语！");
	}
	// 全局设置初始化
	const settingCount = await settingModel.count();
	console.log("setting表条数", settingCount);
	if (!settingCount) {
		settingModel.create({
			avatar: "./public/static/avatar/bada.png",
			siteTitle: "解惑博客",
			github: "",
			qq: "2568070581",
			qqQrcode: "",
			weixin: "18875702527",
			weixinQrcode: "",
			mail: "2568070581@qq.com",
			icp: "",
			githubName: "",
			favicon: ""
		});
	}
	console.log("初始化全局设置表完毕");
})();
