import { execSync } from 'child_process';
import fs from 'fs';

try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('Build succeeded');
} catch (error) {
  const output = (error.stdout ? error.stdout.toString() : '') + '\n' + (error.stderr ? error.stderr.toString() : '');
  fs.writeFileSync('build-error.log', output, 'utf-8');
  console.log('Build failed, wrote to build-error.log');
}
