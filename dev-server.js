import { spawn } from 'child_process';

console.log('Arkvoid Development Bootstrapper starting...');

const child = spawn('npx', ['turbo', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=400'
  }
});

child.on('close', (code) => {
  process.exit(code || 0);
});
