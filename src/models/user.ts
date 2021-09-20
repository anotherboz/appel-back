import * as express from 'express';
import * as cookie from 'cookie-signature';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { Enseignant, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function login(req: express.Request, res: express.Response): Promise<void> {

    const login = req.body.login;
    const password = req.body.password;
    const cookieSignKey = process.env.COOKIE_SIGN_KEY ?? 'defaut sign key'

    console.log('login');
    console.log('login', login, password);
    
    if(login == null || password == null) {
        res.sendStatus(400);
        return;
    }


    const hashedPassword = hashPassword(password);
    console.log('login hashedPassword', hashedPassword);

    const enseignant = await prisma.enseignant.findFirst({ where: {
        login
    }});
    console.log('login enseignant', enseignant);    

    if (enseignant == null) {
        res.sendStatus(404);
        return;
    }

    if (enseignant.password === hashedPassword) {
        res.cookie(
            'session',
            cookie.sign(
                JSON.stringify({
                    id: enseignant.id
                }),
                cookieSignKey
            )
        );
        res.sendStatus(200);

    } else {
        res.sendStatus(401);
    }
    return;
}

export async function getEnseignantFromCookie(req: express.Request): Promise<Enseignant | undefined> {
    const signedSession = req.cookies?.session;
    const cookieSignKey = process.env.COOKIE_SIGN_KEY ?? 'defaut sign key'
    
    console.log('getEnseignantFromCookie', signedSession);
    
    if (signedSession == null) {
        return undefined;
    }
    const session = cookie.unsign(signedSession, cookieSignKey);
    if (session) {
        try {
            let { id } = JSON.parse(session) as { id: number };
            console.log('getEnseignantFromCookie id:',id);
            
            const enseignant = prisma.enseignant.findFirst({
                where: {
                    id
                }
            })
            return enseignant;
        } catch {
            return undefined;
        }
    } else {
        console.log('getEnseignantFromCookie invalid token');
        
        return undefined;
    }
}

export async function createUser(req: express.Request, res: express.Response): Promise<void> {
    const { login, password, codeEcole } = req.body as { login: string; password: string; codeEcole: string; }

    console.log('createUser', login, password, codeEcole);
    
    if (login == null || password == null || codeEcole == null) {
        res.sendStatus(400);
        return;
    }

    let ecole = await prisma.ecole.findFirst({ where: {
        code: codeEcole
    }});

    console.log('ecole found', ecole);
    

    if (ecole == null) {
        res.sendStatus(404);
        return;
    }

    const hashedPassword = hashPassword(password);

    try {
        const newEnseignant = await prisma.enseignant.create({
            data: {
                login,
                password: hashedPassword,
                ecoleId: ecole.id
            }
        });
        res.json(newEnseignant);
    } catch {
        res.sendStatus(406);
        return;
    }
}

export async function createEcole(req: express.Request, res: express.Response): Promise<void> {
    const { nom, code } = req.body as { nom: string, code: string }

    console.log('createEcole', nom, code);
    
    if (nom == null || code == null) {
        res.sendStatus(400);
        return;
    }

    try {
        const newEcole = await prisma.ecole.create({
            data: {
                nom,
                code
            }
        });
        res.json(newEcole);
    } catch {
        res.sendStatus(406);
    }
}


function hashPassword (password: string): string {
    const salt = process.env.HASH_SALT as string ?? 'this is appel salt'
    return Base64.stringify(sha256(salt + password));
}