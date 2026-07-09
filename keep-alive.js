const { spawn } = require('child_process');
const path = require('path');

const server = spawn('node', [
  '--max-old-space-size=384',
  path.join(__dirname, 'node_modules', '.bin', 'next'),
  'start', '-p', '3000', '-H', '0.0.0.0'
], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true
});

server.stdout.on('data', d => process.stdout.write(d));
server.stderr.on('data', d => process.stderr.write(d));
server.unref();

// Keep this process alive
setInterval(() => {
  if (!server.pid || server.exitCode !== null) {
    // Restart
    const s = spawn('node', [
      '--max-old-space-size=384',
      path.join(__dirname, 'node_modules', '.bin', 'next'),
      'start', '-p', '3000', '-H', '0.0.0.0'
    ], { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    s.stdout.on('data', d => process.stdout.write(d));
    s.stderr.on('data', d => process.stderr.write(d));
    s.unref();
  }
}, 5000);