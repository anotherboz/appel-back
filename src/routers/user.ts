import * as express from 'express';
import * as User from '../models/user';

export const router = express.Router();

router.post('/login', User.login);
router.post('/create', User.createUser);
router.post('/ecole', User.createEcole);
