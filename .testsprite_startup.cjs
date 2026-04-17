const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read .env if it exists
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const match = envFile.match(/^TESTSPRITE_API_KEY=(.*)$/m);
  if (match) {
    process.env.API_KEY = match[1].trim();
  }
} catch (e) {
  // Ignore
}

// Spawn the MCP server directly to avoid shell warnings polluting the JSON-RPC pipe
const mcpProcess = spawn('npx.cmd', ['-y', '--yes', '@testsprite/testsprite-mcp@latest'], {
  stdio: 'inherit',
  env: process.env
});

mcpProcess.on('error', (err) => {
  console.error('Failed to start MCP Server:', err);
});
