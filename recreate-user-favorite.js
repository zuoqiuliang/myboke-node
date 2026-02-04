const sequelize = require('./dao/dbConnect');

async function recreateUserFavoriteTable() {
  try {
    console.log('开始重新创建 userFavorite 表...');
    
    // 先删除 userFavorite 表
    await sequelize.query('DROP TABLE IF EXISTS userFavorite;');
    console.log('已删除 userFavorite 表');
    
    // 重新创建 userFavorite 表，只添加指向 userC 和 blog 的外键
    const createTableQuery = `
      CREATE TABLE userFavorite (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        blogId VARCHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES userC(id),
        FOREIGN KEY (blogId) REFERENCES blog(id)
      );
    `;
    
    await sequelize.query(createTableQuery);
    console.log('已重新创建 userFavorite 表');
    
    // 验证新的外键约束
    const checkConstraintsQuery = `
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
    
    const [results] = await sequelize.query(checkConstraintsQuery);
    console.log('新的外键约束:', results);
    
    console.log('重新创建表成功！');
  } catch (error) {
    console.error('错误:', error);
  } finally {
    await sequelize.close();
  }
}

recreateUserFavoriteTable();
