import express from 'express';

import userRoute from './userRoute';
import authRoute from './authRoute';

const router = express.Router();

router.get('/home', (_, res) => res.sendStatus(200));

router.use(userRoute);
router.use(authRoute);

export default router;
