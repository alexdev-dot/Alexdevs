const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('🔍 Checking environment variables...');
console.log('MYSQL_URL:', process.env.MYSQL_URL);

const mysqlUrl = process.env.MYSQL_URL?.trim();
if (!mysqlUrl) {
  console.error('❌ MYSQL_URL is not defined in .env file');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MYSQL')));
  process.exit(1);
}

const sequelize = new Sequelize(mysqlUrl, {
  dialect: 'mysql',
  logging: console.log
});

module.exports = sequelize;
