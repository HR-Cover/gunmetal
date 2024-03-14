#!/usr/bin/env node

const { execSync } = require('child_process');
const gunmetal = require('gunmetal');
var pjson = require('../package.json');

console.log(`gunmetal v${pjson.version}`);

process.env.GULP_PROJECTS_DIR = process.cwd();
process.chdir(gunmetal.dirname); // Ensure this points to the correct directory

try {
  // Assuming gulpfile.js is in the directory pointed by gunmetal.dirname
  execSync('npx gulp --cwd ' + gunmetal.dirname + ' --gulpfile ' + gunmetal.dirname + '/gulpfile.js/index.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing Gulp tasks:', error);
}
