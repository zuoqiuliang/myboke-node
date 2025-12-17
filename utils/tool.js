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
		const basename = path.basename(
			file.originalname,
			path.extname(file.originalname)
		);
		const extname = path.extname(file.originalname);
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
	limits: { fileSize: 2000000, files: 1 }
});

// 将 markdown 中的内容转成数组目录的格式
exports.formatToc = (markdownInfo) => {
	markdownToc(markdownInfo).json(); //可以将 markdown 中的内容提取出标题成一个数组
};
