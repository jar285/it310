const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// Read the current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error reading .env file:', error.message);
  process.exit(1);
}

// Update the DATABASE_URL
const updatedContent = envContent.replace(
  /^DATABASE_URL=.*$/m,
  'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tutortrend?schema=public"'
);

// Write the updated content back to the .env file
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('Successfully updated DATABASE_URL in .env file');
  console.log('New DATABASE_URL: postgresql://postgres:postgres@localhost:5432/tutortrend?schema=public');
} catch (error) {
  console.error('Error writing to .env file:', error.message);
  process.exit(1);
}
