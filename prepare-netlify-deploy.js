#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// Check if we're in the root directory of the project
const isRootDir = fs.existsSync('package.json') && 
                 fs.existsSync('next.config.js');

if (!isRootDir) {
  console.error('Please run this script from the root directory of your project.');
  process.exit(1);
}

// Create netlify.toml if it doesn't exist
const netlifyTomlPath = path.join(process.cwd(), 'netlify.toml');
if (!fs.existsSync(netlifyTomlPath)) {
  console.log('Creating netlify.toml...');
  const netlifyToml = `[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY = "true"
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  external_node_modules = ["@supabase/supabase-js"]`;

  fs.writeFileSync(netlifyTomlPath, netlifyToml);
  console.log('netlify.toml created successfully!');
}

// Check for Next.js config and update it if needed
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('Checking next.config.js...');
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  if (!nextConfig.includes('output:')) {
    console.log('Updating next.config.js to include output: standalone...');
    const updatedConfig = nextConfig.replace(
      'const nextConfig = {', 
      'const nextConfig = {\n  output: \'standalone\','
    );
    fs.writeFileSync(nextConfigPath, updatedConfig);
    console.log('next.config.js updated successfully!');
  }
}

// Check for environment variables
const envLocalPath = path.join(process.cwd(), '.env.local');
const envProdPath = path.join(process.cwd(), '.env.production');

if (fs.existsSync(envLocalPath) && !fs.existsSync(envProdPath)) {
  console.log('Creating .env.production from .env.local...');
  fs.copyFileSync(envLocalPath, envProdPath);
  console.log('.env.production created successfully!');
}

// Create Netlify functions directory
const netlifyFunctionsDir = path.join(process.cwd(), 'netlify', 'functions');
if (!fs.existsSync(netlifyFunctionsDir)) {
  console.log('Creating Netlify functions directory...');
  fs.mkdirSync(netlifyFunctionsDir, { recursive: true });
  
  // Create a sample function
  const helloWorldPath = path.join(netlifyFunctionsDir, 'hello-world.js');
  const helloWorldCode = `// Serverless Function
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify Functions!" }),
  };
};`;
  
  fs.writeFileSync(helloWorldPath, helloWorldCode);
  console.log('Sample Netlify function created successfully!');
}

console.log('\nYour project is now prepared for Netlify deployment!');
console.log('\nNext steps:');
console.log('1. Push your code to a Git repository');
console.log('2. Login to Netlify and create a new site from your repository');
console.log('3. Add the following environment variables in Netlify:');
console.log('   - NEXT_PUBLIC_SUPABASE_URL');
console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
console.log('\nFor more detailed instructions, see NETLIFY_SETUP.md'); 