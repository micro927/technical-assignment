import { AppHandler } from '@/types/app.js';
import { verifyAccessToken } from '@/utils/authToken.js';

const verifyToken: AppHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  const result = verifyAccessToken(accessToken);

  if (result.success) {
    res.locals.id = result?.id ?? '';
    next();
  } else {
    res.sendStatus(result.status);
  }
};

export default verifyToken;
