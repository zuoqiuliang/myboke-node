// 测试数据库模型同步
const sequelize = require('./dao/dbConnect');

// 引入所有模型
const adminModel = require('./dao/model/adminModel');
const bannerModel = require('./dao/model/bannerModel');
const blogModel = require('./dao/model/blogModel');
const blogTypeModel = require('./dao/model/blogTypeModel');
const demoModel = require('./dao/model/demoModel');
const messageModel = require('./dao/model/messageModel');
const settingModel = require('./dao/model/settingModel');
const userCModel = require('./dao/model/userCModel');
const userInfoModel = require('./dao/model/userInfoModel');

async function testModelSync() {
  try {
    console.log('开始测试模型同步...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');
    
    // 执行模型同步
    await sequelize.sync({ alter: true });
    console.log('所有模型同步成功');
    
    // 测试模型基本操作
    const adminCount = await adminModel.count();
    console.log(`admin表数据量: ${adminCount}`);
    
    const blogTypeCount = await blogTypeModel.count();
    console.log(`blogType表数据量: ${blogTypeCount}`);
    
    console.log('所有测试通过！模型修改成功。');
    process.exit(0);
  } catch (error) {
    console.error('测试失败：', error);
    process.exit(1);
  }
}

testModelSync();