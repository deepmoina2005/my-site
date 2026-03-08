const { execSync } = require('child_process');
const fs = require('fs');

try {
  execSync('npx tsc -b', { stdio: 'pipe' });
  console.log('No errors');
} catch (error) {
  fs.writeFileSync('errors.log', error.stdout.toString() + error.stderr.toString());
  console.log('Errors written to errors.log');
}
