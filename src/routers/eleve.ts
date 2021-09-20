import * as express from 'express';
import * as Eleve from '../models/eleve';

export const router = express.Router();

router.get('/', Eleve.get);
router.post('/', Eleve.create);
router.delete('/', Eleve.deleteEleve);

