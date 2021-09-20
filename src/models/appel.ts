import * as express from 'express';
import moment from 'moment';
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

    const morning = moment().startOf('day').toDate();
    const night = moment().endOf('day').toDate();

    if (enseignant) {
        try {
            const eleves = await prisma.appel.findMany({
                select: {
                    id: true,
                    date: true,
                    presence: true,
                    eleve: {
                        select: {
                            nom: true,
                            prenom: true,
                            enseignant: {
                                select: {
                                    id: true,
                                    login: true
                                }
                            }
                        }
                    }
                },
                where: {
                    date: {
                        gt: morning,
                        lt: night,
                    },
                    eleve: {
                        enseignant: {
                            id: enseignant.id
                        }
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
    console.log('appel/create', enseignant);
    let { eleveId, date, presence } = req.body as { eleveId: number; date: Date; presence: number };
    date = new Date(date);

    if (eleveId == null || date == null || presence == null) {
        res.sendStatus(400);
        return;
    }
    try {
        const newAppel = await prisma.appel.create({
            data: {
                eleveId,
                date,
                presence
            }
        })

        res.status(200).json(newAppel);
    } catch {
        res.sendStatus(500);
        return;
    }
}
