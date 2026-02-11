exports.exClude = [
	{ url: "/api/admin/login", methods: ["POST"] },
	{ url: "/res/captcha", methods: ["GET"] },
	{ url: "/api/banner", methods: ["GET"] },
	{ url: "/api/blogType", methods: ["GET", "POST"] },
	{ url: "/api/blog", methods: ["GET"] },
	{ url: /\/api\/blog\/.+/, methods: ["GET"] }, //排除规则支持正则
	{ url: "/api/project", methods: ["GET"] },
	{ url: "/api/message", methods: ["GET", "POST"] },
	{ url: "/api/user/register", methods: ["POST"] },
	{ url: "/api/user/login", methods: ["POST"] },
	{ url: "/api/tag", methods: ["GET"] }, // 获取标签列表
	{ url: "/api/tag/tree", methods: ["GET"] }, // 获取标签树
	{ url: "/api/proxy/image", methods: ["GET"] }, // 图片代理路由
	{ url: "/api/blog/recommended", methods: ["GET"] } // 获取用户信息
];
