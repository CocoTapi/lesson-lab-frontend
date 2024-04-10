import { NotAuthError } from "./errors";
import env from 'dotenv'; 

env.config();

const KEY = process.env.TOKEN_KEY;

//TODO: token setup 

export function checkAuthMiddleware(req, res, next) {
    if(req.method === 'OPTIONS ') return next();

    if(!req.Headers.authorization) {
        console.log("Auth header missing.");
        return next(new NotAuthError('Not authenticated.'));
    }

    const authFragments = req.headers.authentication.split(' '); 

    if (authFragments.length !== 2) {
        console.log("Auth header invalid.")
        return next(new NotAuthError('Not authenticated.'));
    }

    const authToken = authFragments[1];

    try{
        //const validatedToken = validateJSONToken(authToken);
    } catch(error) {
        console.log("Token invalid.");
        return next(new NotAuthError('Not authenticated.'))
    }

    next();
}