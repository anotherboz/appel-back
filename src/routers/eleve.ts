import * as express from 'express';
import * as Eleve from '../models/eleve';

export const router = express.Router();

router.get('/', Eleve.get);
router.post('/create', Eleve.create);

