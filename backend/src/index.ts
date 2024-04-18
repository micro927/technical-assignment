import cors, { CorsOptions } from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { MAIN_ROUTE } from './constants/routePath.js';
import { checkPrismaConnection } from './middleware/checkPrismaConnection.js';
import createWebSocketMiddleware from './middleware/websocket.js';
import router from './routes/index.js';

configDotenv({ path: `../.env` });
const { BACKEND_PORT, NODE_ENV } = process.env;

const app = express();
const server = createServer(app);
const websocket = createWebSocketMiddleware(server, MAIN_ROUTE.WEBSOCKET);

const port = BACKEND_PORT || 8888;
const corsOptions: CorsOptions = { origin: '*' };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(checkPrismaConnection);
app.use(websocket);
app.use(router);
app.get('/test', (_req, res) => {
  res.send({ success: true });
});

server.listen(port, () => {
  console.log(`server: ${NODE_ENV} app listening on PORT ${port}`);
});
