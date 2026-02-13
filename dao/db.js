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
const userCModel = require("./model/userCModel");
const userInfoModel = require("./model/userInfoModel");
const tagModel = require("./model/tagModel");
const blogTagModel = require("./model/blogTagModel");
const userFavoriteModel = require("./model/userFavoriteModel");
const userLikeModel = require("./model/userLikeModel");
const userFollowModel = require("./model/userFollowModel");
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
	 * 定义用户表和评论表关联
	 */
	userCModel.hasMany(messageModel, {
		foreignKey: "userId",
		targetKey: "id"
	});
	messageModel.belongsTo(userCModel, {
		foreignKey: "userId",
		targetKey: "id",
		as: "user"
	});
	/**
	 * 定义用户表和文章表关联
	 */
	userCModel.hasMany(blogModel, {
		foreignKey: "userId",
		targetKey: "id"
	});
	blogModel.belongsTo(userCModel, {
		foreignKey: "userId",
		targetKey: "id",
		as: "user"
	});
	/**
	 * 定义用户和用户信息表关联 一对一
	 */
	userCModel.hasOne(userInfoModel, {
		foreignKey: "userId",
		targetKey: "id"
	});
	userInfoModel.belongsTo(userCModel, {
		foreignKey: "userId",
		targetKey: "id",
		as: "user"
	});

	/**
	 * 定义文章和用户信息表直接关联
	 */
	blogModel.belongsTo(userInfoModel, {
		foreignKey: "userId",
		targetKey: "userId",
		as: "userInfo"
	});

	/**
	 * 定义标签的自关联关系（用于层级结构）
	 */
	tagModel.belongsTo(tagModel, {
		foreignKey: "parentId",
		targetKey: "id",
		as: "parent"
	});
	tagModel.hasMany(tagModel, {
		foreignKey: "parentId",
		targetKey: "id",
		as: "children"
	});

	/**
	 * 定义文章和标签的多对多关系
	 */
	blogModel.belongsToMany(tagModel, {
		through: blogTagModel, // 通过中间表关联
		foreignKey: "blogId", // 文章在中间表中的外键
		otherKey: "tagId", // 标签在中间表中的外键
		as: "tags" // 别名，用于查询时使用
	});
	tagModel.belongsToMany(blogModel, {
		through: blogTagModel, // 通过中间表关联
		foreignKey: "tagId", // 标签在中间表中的外键
		otherKey: "blogId", // 文章在中间表中的外键
		as: "blogs" // 别名，用于查询时使用
	});

	/**
	 * 定义用户和文章的多对多关系（收藏）
	 */
	userCModel.belongsToMany(blogModel, {
		through: userFavoriteModel, // 通过中间表关联
		foreignKey: "userId", // 用户在中间表中的外键
		otherKey: "blogId", // 文章在中间表中的外键
		as: "favoriteBlogs" // 别名，用于查询时使用
	});
	blogModel.belongsToMany(userCModel, {
		through: userFavoriteModel, // 通过中间表关联
		foreignKey: "blogId", // 文章在中间表中的外键
		otherKey: "userId", // 用户在中间表中的外键
		as: "favoritedUsers" // 别名，用于查询时使用
	});

	/**
	 * 定义用户和文章的多对多关系（点赞）
	 */
	userCModel.belongsToMany(blogModel, {
		through: userLikeModel, // 通过中间表关联
		foreignKey: "userId", // 用户在中间表中的外键
		otherKey: "blogId", // 文章在中间表中的外键
		as: "likedBlogs" // 别名，用于查询时使用
	});
	blogModel.belongsToMany(userCModel, {
		through: userLikeModel, // 通过中间表关联
		foreignKey: "blogId", // 文章在中间表中的外键
		otherKey: "userId", // 用户在中间表中的外键
		as: "likedUsers" // 别名，用于查询时使用
	});

	/**
	 * 定义用户和用户的多对多关系（关注）
	 */
	userCModel.belongsToMany(userCModel, {
		through: userFollowModel, // 通过中间表关联
		foreignKey: "followerId", // 关注者在中间表中的外键
		otherKey: "followingId", // 被关注者在中间表中的外键
		as: "following" // 别名，用于查询关注列表
	});
	userCModel.belongsToMany(userCModel, {
		through: userFollowModel, // 通过中间表关联
		foreignKey: "followingId", // 被关注者在中间表中的外键
		otherKey: "followerId", // 关注者在中间表中的外键
		as: "followers" // 别名，用于查询粉丝列表
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
	// 初始化博客分类数据
	const blogTypeCount = await blogTypeModel.count();
	console.log("blogType表条数：", blogTypeCount);
	if (!blogTypeCount) {
		await blogTypeModel.bulkCreate([
			{ name: "前端开发", arcticleCount: 0, order: 1, path: "frontend" },
			{ name: "后端开发", arcticleCount: 0, order: 2, path: "backend" },
			{ name: "数据库", arcticleCount: 0, order: 3, path: "database" },
			{ name: "DevOps & 工具", arcticleCount: 0, order: 4, path: "devops" },
			{ name: "移动开发", arcticleCount: 0, order: 5, path: "mobile" },
			{ name: "人工智能 & 数据", arcticleCount: 0, order: 6, path: "ai" },
			{ name: "其他", arcticleCount: 0, order: 7, path: "other" }
		]);
		console.log("初始化博客分类数据完毕");
	}
	// 初始化用户数据
	const userCCount = await userCModel.count();
	console.log("userC表条数：", userCCount);
	if (!userCCount) {
		const user = await userCModel.create({
			phone: "13800138000",
			password: md5("123456")
		});
		// 初始化用户信息数据
		await userInfoModel.create({
			userName: "测试用户",
			careerDirection: "前端开发",
			selfIntroduction: "这是一个测试用户",
			avatar: "/static/images/avatar.png",
			userId: user.id
		});
		console.log("初始化用户数据完毕");
	}
	// 初始化标签数据
	const tagCount = await tagModel.count();
	console.log("tag表条数：", tagCount);
	if (!tagCount) {
		// 前端开发标签
		const frontendTag = await tagModel.create({
			name: "前端开发",
			parentId: null,
			order: 1
		});
		await tagModel.bulkCreate([
			{ name: "React", parentId: frontendTag.id, order: 1 },
			{ name: "Vue", parentId: frontendTag.id, order: 2 },
			{ name: "Angular", parentId: frontendTag.id, order: 3 },
			{ name: "JavaScript", parentId: frontendTag.id, order: 4 },
			{ name: "TypeScript", parentId: frontendTag.id, order: 5 },
			{ name: "HTML5", parentId: frontendTag.id, order: 6 },
			{ name: "CSS3", parentId: frontendTag.id, order: 7 }
		]);
		// 后端开发标签
		const backendTag = await tagModel.create({
			name: "后端开发",
			parentId: null,
			order: 2
		});
		await tagModel.bulkCreate([
			{ name: "Node.js", parentId: backendTag.id, order: 1 },
			{ name: "Python", parentId: backendTag.id, order: 2 },
			{ name: "Java", parentId: backendTag.id, order: 3 },
			{ name: "Golang", parentId: backendTag.id, order: 4 },
			{ name: "PHP", parentId: backendTag.id, order: 5 }
		]);
		console.log("初始化标签数据完毕");
	}
	// 初始化博客数据
	const blogCount = await blogModel.count();
	console.log("blog表条数：", blogCount);
	if (!blogCount) {
		const user = await userCModel.findOne();
		const blogType = await blogTypeModel.findOne({ where: { name: "前端开发" } });
		const blog = await blogModel.create({
			title: "欢迎使用解惑博客",
			description: "这是一篇测试文章，欢迎使用解惑博客系统",
			toc: '["欢迎使用解惑博客"]',
			htmlContent:
				"<h1>欢迎使用解惑博客</h1><p>这是一篇测试文章，欢迎使用解惑博客系统</p>",
			markdownContent: "# 欢迎使用解惑博客\n\n这是一篇测试文章，欢迎使用解惑博客系统",
			thumb: "/static/images/a.png",
			scanNumber: 0,
			commentNumber: 0,
			categoryId: blogType.id,
			userId: user.id
		});
		console.log("初始化博客数据完毕");
	}
})();
