const jwt = require("jsonwebtoken");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");
const markdownToc = require("markdown-toc");
// 服务器要相应给客户端标准格式的数据
exports.formatResponse = (code, msg = "success", data) => {
	return {
		code,
		msg,
		data
	};
};
//解析 token并恢复成对象格式
exports.analysisToken = (token) => {
	return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET));
};

exports.analysisCookieToken = (token) => {
	return jwt.verify(token, md5(process.env.JWT_SECRET));
};
// 格式化从表中取出的数组数据格式，取出 dataValues 等多余信息
exports.formatFormDaoData = (data) => {
	let arr = [];
	for (const item of data) {
		arr.push(item.dataValues);
	}
	return arr;
};

/**
 * 
 * multer 文档链接：https://github.com/expressjs/multer/blob/main/doc/README-zh-cn.md
 * 磁盘存储引擎 (DiskStorage)
  磁盘存储引擎可以让你控制文件的存储
  Multer 会添加一个 body 对象 以及 file 或 files 对象 到 express 的 request 对象中。 body 对象包含表单的文本域信息，file 或 files 对象包含对象表单上传的文件信息。


  每个文件具有下面的信息:
  Key	Description	Note
  fieldname	Field name 由表单指定	
  originalname	用户计算机上的文件的名称	
  encoding	文件编码	
  mimetype	文件的 MIME 类型	
  size	文件大小（字节单位）	
  destination	保存路径	DiskStorage
  filename	保存在 destination 中的文件名	DiskStorage
  path	已上传文件的完整路径	DiskStorage
  buffer	一个存放了整个文件的 Buffer	MemoryStorage

 */
const storage = multer.diskStorage({
	// destination 是用来确定上传的文件应该存储在哪个文件夹中。也可以提供一个 string (例如 '/tmp/uploads')。如果没有设置 destination，则使用操作系统默认的临时文件夹。
	destination: function (req, file, cb) {
		cb(null, __dirname + "/../public/static/uploads");
	},
	// filename 用于确定文件夹中的文件名的确定。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的,为什么要把上传的文件名随机处理呢？因为每个用户可能上传相同的文件名，会覆盖，所以做随机名字。
	filename: function (req, file, cb) {
		const basename = path.basename(file.originalname, path.extname(file.originalname));
		const extname = path.extname(file.originalname) || ".png";
		const newName =
			basename +
			"_" +
			new Date().getTime() +
			Math.floor(Math.random() * 9000 + 1000) +
			extname;
		cb(null, newName);
	}
});

exports.uploading = multer({
	storage: storage,
	limits: { fileSize: 6000000, files: 1 }
});

// 将 markdown 中的内容转成数组目录的格式
exports.formatToc = (markdownInfo) => {
	// 一维数组
	const flatTocArr = markdownToc(markdownInfo).json; //可以将 markdown 中的内容提取出标题成一个下面的数组
	console.log(flatTocArr, "flatTocArr");
	// [
	//   {
	//     content: 'vue 颠覆式的开发方式',
	//     slug: 'vue-颠覆式的开发方式',
	//     lvl: 1,
	//     i: 0,
	//     seen: 0
	//   },
	//   { content: '解疑', slug: '解疑', lvl: 2, i: 1, seen: 0 },
	//   { content: 'vue的核心功能', slug: 'vue的核心功能', lvl: 2, i: 2, seen: 0 }
	// ]
	// 我们需要转成下面的格式
	// [
	//   {
	//     content: 'vue 颠覆式的开发方式',
	//     slug: 'vue-颠覆式的开发方式',
	//     lvl: 1,
	//     i: 0,
	//     seen: 0,
	//     children: [
	//       { content: '解疑', slug: '解疑', lvl: 2, i: 1, seen: 0 },
	//       { content: 'vue的核心功能', slug: 'vue的核心功能', lvl: 2, i: 2, seen: 0 }
	//     ]
	//   }
	// ]
	// 转换函数
	function transfer(flatTocArr) {
		let result = [];
		let stack = [];
		let min = 6; //默认最大的标题数是 6 级，最小 1 级
		function createTocItem(item) {
			return {
				content: item.content,
				slug: item.slug,
				level: item.lvl,
				i: item.i,
				seen: item.seen,
				children: []
			};
		}
		function getLastItem(item) {
			const top = stack[stack.length - 1];
			if (!top) {
				stack.push(item);
			} else if (item.level > top.level) {
				top.children.push(item);
				stack.push(item);
			} else {
				stack.pop();
				getLastItem(item);
			}
		}
		for (let item of flatTocArr) {
			if (item.lvl <= min) {
				min = item.lvl;
			}
		}
		for (let item of flatTocArr) {
			const tocItem = createTocItem(item);
			if (item.lvl === min) {
				result.push(tocItem);
			}

			getLastItem(tocItem);
		}
		return result;
	}
	return transfer(flatTocArr);
};

/**
 * 根据环境变量获取对应的域名
 * @returns {string} 当前环境的域名
 */
exports.getDomainByEnv = function getDomainByEnv() {
	// 获取环境变量 NODE_ENV（默认开发环境）
	console.log(process.env.NODE_ENV, "NODE_ENV");
	const env = process.env.NODE_ENV || "development";
	console.log("当前环境:", env);

	// 根据环境选择域名
	let domain = "";
	if (env === "production") {
		// 生产环境域名（从 .env 文件读取）
		domain = process.env.PROD_DOMAIN || "https://123.56.177.104";
	} else {
		// 开发环境域名（从 .env 文件读取）
		domain = process.env.DEV_DOMAIN || "http://localhost:3000";
	}

	console.log("使用的域名:", domain);
	return domain;
};
