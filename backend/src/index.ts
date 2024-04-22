import { MAIN_ROUTE } from '@/constants/route.js';
import cors, { CorsOptions } from 'cors';
import { configDotenv } from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { checkPrismaConnection } from './middleware/checkPrismaConnection.js';
import createWebSocketMiddleware from './middleware/websocket.js';
import router from './routes/index.js';

configDotenv({ path: `../.env` });
const { BACKEND_PORT, NODE_ENV } = process.env;

const app = express();
const server = createServer(app);
const websocket = createWebSocketMiddleware(server, MAIN_ROUTE.WEBSOCKET);

const port = BACKEND_PORT || 8888;
const corsOptions: CorsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(checkPrismaConnection);
app.use(websocket);
app.use(router);
app.get('/test', async (_req, res) => {
  res.send({ success: true });

  // const a = await prisma.user.findMany({
  //   select: { name: true, friendIDs: true, friendOfIDs: true },
  // });
  // res.send(a);
  // const hashedPassword = await bcrypt.hash('bbbb', 10);
  // try {
  //   const a = await prisma.user.findMany();
  //   console.log(a);
  //   prisma.user
  //     .create({
  //       data: {
  //         email: 'bbbb@example.com',
  //         password: hashedPassword,
  //         name: 'Mr. B',
  //       },
  //     })
  //     .then((a) => {
  //       console.log('-----------------', a);
  //     });
  //   res.send({ success: true });
  // } catch (e) {
  //   console.log(e);
  // }
});

server.listen(port, () => {
  console.log(`server: ${NODE_ENV} app listening on PORT ${port}`);
});
