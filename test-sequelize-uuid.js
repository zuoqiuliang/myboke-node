require('dotenv').config();
const userCModel = require('./dao/model/userCModel');
const { v4: uuidv4 } = require('uuid');

async function testSequelizeUUID() {
    try {
        console.log('=== Testing Sequelize UUID Generation ===');
        
        // Test raw UUID generation
        const rawUUID = uuidv4();
        console.log('Raw UUID:', rawUUID);
        console.log('Raw UUID length:', rawUUID.length);
        
        // Create a new instance manually
        const userInstance = userCModel.build({
            phone: '13800138001',
            password: 'test123'
        });
        
        console.log('\n=== Before Save ===');
        console.log('User instance id:', userInstance.id);
        console.log('User instance id length:', userInstance.id ? userInstance.id.length : 'undefined');
        
        // Save the instance
        await userInstance.save();
        
        console.log('\n=== After Save ===');
        console.log('User instance id:', userInstance.id);
        console.log('User instance id length:', userInstance.id.length);
        
        console.log('\n=== User Data ===');
        console.log('Phone:', userInstance.phone);
        console.log('Password:', userInstance.password);
        
        console.log('\n=== Test Completed Successfully ===');
    } catch (error) {
        console.error('=== Test Failed ===');
        console.error('Error:', error);
        process.exit(1);
    }
}

testSequelizeUUID();