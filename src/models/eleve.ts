import * as express from 'express';
import { getEnseignantFromCookie } from './user'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function get(req: express.Request, res: express.Response): Promise<void> {
    const enseignant = await getEnseignantFromCookie(req);
    console.log('eleve/', enseignant);

    if (enseignant == null) {
        res.sendStatus(400);
        return;
    }

    if (enseignant) {
        const eleves = await prisma.eleve.findMany({
            where: {
                enseignant: {
                    id: enseignant.id
                }
            }
        });
        res.json(eleves);
    }
}

export async function create(req: express.Request, res: express.Response): Promise<void> {
    const enseignant = await getEnseignantFromCookie(req);
    console.log('eleve/create', enseignant);
    
}