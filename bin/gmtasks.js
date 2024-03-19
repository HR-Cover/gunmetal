#!/usr/bin/env node

const { execSync } = require('child_process');
const gunmetal = require('gunmetal');
var pjson = require('../package.json');

console.log(`gunmetal v${pjson.version}`);

process.env.GULP_PROJECTS_DIR = process.cwd();
process.chdir(gunmetal.dirname);

try {
  // const execSyncCmd = 'npx gulp --cwd ' + gunmetal.dirname + ' --gulpfile ' + gunmetal.dirname + '/gulpfile.js/index.js';
  const execSyncCmd = 'npx gulp --cwd ' + gunmetal.dirname + ' --gulpfile ' + gunmetal.dirname + '/gulpfile.js/index.js ' + process.argv.slice(2).join(' ');
  console.log('execSyncCmd', execSyncCmd);
  execSync(execSyncCmd, { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing Gulp tasks:', error);
}
