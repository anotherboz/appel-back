import * as express from 'express';
import * as Appel from '../models/appel';

export const router = express.Router();

router.get('/', Appel.get);
router.post('/', Appel.create);