require("dotenv").config();
const { addUserDao } = require("./dao/userDao");

async function testAddUser() {
	try {
		console.log("开始测试添加用户...");
		const user = {
			phone: "13800138003",
			password: "test123"
		};
		console.log("=== 使用 addUserDao 方法 ===");
		const result = await addUserDao(user);
		console.log("添加用户成功:", result);
		console.log("生成的id:", result.id);
		console.log("id长度:", result.id.length);
	} catch (error) {
		console.error("添加用户失败:", error);
		console.error(
			"错误详情:",
			error.original ? error.original.sqlMessage : error.message
		);
		process.exit(1);
	}
}

testAddUser();
