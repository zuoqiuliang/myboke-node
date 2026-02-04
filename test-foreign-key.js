const sequelize = require('./dao/dbConnect');

async function testForeignKey() {
  try {
    console.log('开始测试外键约束...');
    
    // 检查 userFavorite 表结构
    const query = `
      SELECT 
        CONSTRAINT_NAME, 
        COLUMN_NAME, 
        REFERENCED_TABLE_NAME, 
        REFERENCED_COLUMN_NAME 
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE 
        TABLE_NAME = 'userFavorite' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `;
    
    const [results] = await sequelize.query(query);
    console.log('userFavorite 表的外键约束:', results);
    
    // 检查 userInfo 表结构
    const userInfoQuery = `
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'userInfo'
    `;
    
    const [userInfoCols] = await sequelize.query(userInfoQuery);
    console.log('userInfo 表的列:', userInfoCols);
    
    // 检查 blog 表结构
    const blogQuery = `
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'blog'
    `;
    
    const [blogCols] = await sequelize.query(blogQuery);
    console.log('blog 表的列:', blogCols);
    
    console.log('测试完成！');
  } catch (error) {
    console.error('测试错误:', error);
  } finally {
    await sequelize.close();
  }
}

testForeignKey();
