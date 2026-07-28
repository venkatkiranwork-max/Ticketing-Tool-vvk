import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const server = http.createServer(app);

  // Phase 9: Socket.IO will attach here
  // initSocket(server);

  server.listen(env.port, () => {
    console.info(`Server running on http://localhost:${env.port}`);
    console.info(`Environment: ${env.nodeEnv}`);
    console.info(`API base: http://localhost:${env.port}/api/v1`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
