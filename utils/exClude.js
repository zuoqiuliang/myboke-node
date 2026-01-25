exports.exClude = [
	{ url: "/api/admin/login", methods: ["POST"] },
	{ url: "/res/captcha", methods: ["GET"] },
	{ url: "/api/banner", methods: ["GET"] },
	{ url: "/api/blogType", methods: ["GET", "POST"] },
	{ url: "/api/blog", methods: ["GET"] },
	{ url: /\api\/blog\/\d/, methods: ["GET"] }, //排除规则支持正则
	{ url: "/api/project", methods: ["GET"] },
	{ url: "/api/message", methods: ["GET", "POST"] },
	{ url: "/api/user/register", methods: ["POST"] },
	{ url: "/api/user/login", methods: ["POST"] }
];
