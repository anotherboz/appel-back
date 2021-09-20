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
        try {
            const eleves = await prisma.eleve.findMany({
                select: {
                    id: true,
                    nom: true,
                    prenom: true,
                    hide: true
                },
                where: {
                    enseignant: {
                        id: enseignant.id
                    }
                }
            });
            res.json(eleves);
        } catch {
            res.sendStatus(500)
        }
    }
}

export async function create(req: express.Request, res: express.Response): Promise<void> {
    const enseignant = await getEnseignantFromCookie(req);
    console.log('eleve/create', enseignant);
    const { nom, prenom } = req.body as { nom: string; prenom: string };

    if (nom == null || prenom == null) {
        res.sendStatus(400);
        return;
    }
    try {
        const newEleve = await prisma.eleve.create({
            data: {
                nom,
                prenom,
                enseignantId: enseignant.id
            }
        })

        res.status(200).json(newEleve);
    } catch {
        res.sendStatus(500);
        return;
    }
}

export async function deleteEleve(req: express.Request, res: express.Response): Promise<void> {
    const enseignant = await getEnseignantFromCookie(req);
    console.log('eleve/delete', enseignant);

    const { id } = req.body as { id: number };

    console.log(req.body);
    if (id == null) {
        res.sendStatus(400);
        return;
    }
    try {
        await prisma.eleve.delete({
            where: {
                id
            }
        })
        res.sendStatus(200);
    } catch {
        res.sendStatus(500);
    }
}