import express from 'express';
import prisma from './utils/db.js';
import { hash } from 'bcrypt';
import { HTTP_STATUS } from './constants/httpStatus.js';
import { parseNumber } from './utils/queryParser.js';

const addFriend = (id: string, friendID: string) => [
  prisma.user.update({
    where: {
      id,
      NOT: { friends: { some: { id: friendID } } },
    },
    data: {
      friendIDs: { push: friendID },
    },
  }),
  prisma.user.update({
    where: {
      id: friendID,
      NOT: { friends: { some: { id } } },
    },
    data: {
      friendIDs: {
        push: id,
      },
    },
  }),
];
const getRandom = () => Math.min(97 + Math.round(Math.random() * 26), 122);
const createEmail = (char: string) =>
  `${char}${char}${char}${char}@example.com`;

const devRouter = express.Router();

devRouter.get('/add-friends', async (req, res) => {
  const email = (req.query?.email ?? '') as string;
  const n = parseInt((req.query?.n ?? '0') as string);
  const emails = [];
  for (let i = 0; i < n; i++) {
    const c = getRandom();
    emails.push(createEmail(String.fromCharCode(c)));
  }
  const dataList = [...new Set(emails)];

  const found = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (found) {
    const { id } = found;

    prisma.user
      .findMany({
        where: {
          email: { in: dataList },
          NOT: { id },
        },
        select: { id: true },
      })
      .then((friendIDs) => {
        prisma
          .$transaction(
            friendIDs.map(({ id: friendID }) => addFriend(id, friendID)).flat(),
          )
          .then(() => {
            console.log('ok');
            return res.send({ email, dataList });
          })
          .catch(() => {
            console.log(id, 'err');
            return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
          });
      });
  }
});

devRouter.get('/reset-user', async (req, res) => {
  await prisma.user.deleteMany();
  const data = [];
  for (let i = 97; i <= 122; i++) {
    const char = String.fromCharCode(i);
    const email = `${char}${char}${char}${char}@example.com`;
    const password = await hash('123456', 10);
    const name = `Mr. ${char.toUpperCase()}`;
    data.push({ email, password, name });
  }
  const r = await prisma.user.createMany({ data });
  console.log(r);
  res.send({ success: true });
});

devRouter.get('/dev-users', async (req, res) => {
  try {
    const { id } = res.locals;
    const search = ((req.query?.search ?? '') as string).trim();
    const limit = parseNumber(req.query?.limit as string);
    if (search === '') return res.status(HTTP_STATUS.NO_CONTENT_204).send([]);
    prisma.user
      .findMany({
        select: {
          id: true,
          name: true,
          friendIDs: true,
        },
        where: {
          OR: [{ email: { contains: search } }, { name: { contains: search } }],
          NOT: { id },
        },
        take: limit,
      })
      .then((users) => res.status(HTTP_STATUS.OK_200).send(users))
      .catch(() => res.sendStatus(HTTP_STATUS.NO_CONTENT_204));
  } catch (error) {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR_500);
  }
});

export default devRouter;
