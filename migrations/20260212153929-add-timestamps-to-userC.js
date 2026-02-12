'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    // 第一步：添加允许空的createdAt字段
    await queryInterface.addColumn('userC', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: true
    });
    
    // 第二步：添加允许空的updatedAt字段
    await queryInterface.addColumn('userC', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: true
    });
    
    // 第三步：更新现有行的时间字段值
    await queryInterface.sequelize.query(
      'UPDATE userC SET createdAt = NOW(), updatedAt = NOW() WHERE createdAt IS NULL OR updatedAt IS NULL'
    );
    
    // 第四步：修改字段为不允许空
    await queryInterface.changeColumn('userC', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    });
    
    await queryInterface.changeColumn('userC', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     */
    // 移除updatedAt字段
    await queryInterface.removeColumn('userC', 'updatedAt');
    
    // 移除createdAt字段
    await queryInterface.removeColumn('userC', 'createdAt');
  }
};
