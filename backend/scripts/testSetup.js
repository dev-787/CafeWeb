require('dotenv').config();

console.log('🔍 Testing Backend Configuration\n');

// Check environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'UPI_ID',
  'CAFE_NAME'
];

let allPresent = true;

requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '***' : process.env[varName]}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allPresent = false;
  }
});

console.log(`\n📍 PORT: ${process.env.PORT || 5000}`);
console.log(`📍 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

if (allPresent) {
  console.log('\n✅ All required environment variables are set!');
  console.log('\nNext steps:');
  console.log('1. Start MongoDB');
  console.log('2. Run: npm run seed (optional)');
  console.log('3. Run: npm run dev');
} else {
  console.log('\n❌ Some environment variables are missing!');
  console.log('Please check your .env file');
}
