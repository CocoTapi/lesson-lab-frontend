import { NotAuthError } from "./errors";
import { sign, verify, Secret } from "jsonwebtoken";
import env from 'dotenv'; 
import { NextFunction } from "express";
import { AuthRequest } from "./types";

env.config();

const KEY: Secret | undefined = process.env.TOKEN_KEY;

export function createJSONToken(email: string) {
    if (!KEY) {
        throw new Error("Token key is not defined.");
    }
    return sign({ email }, KEY, { expiresIn: '1h' });
}

export function validateJSONToken(token: any) {
    if (!KEY) {
        throw new Error("Token key is not defined.");
    }
    return verify(token, KEY);
}

export async function verifyToken(authHeader: string) {
    const authFragments = authHeader.split(' '); 
  
    if (authFragments.length !== 2) {
        throw Error('Auth header invalid. Not authenticated.');
    }

    const authToken = authFragments[1];

    const decoded = validateJSONToken(authToken);
    console.log("decoded:", decoded);

   // Check if decoded is an object (JwtPayload)
    if (typeof decoded !== 'object' || decoded === null) {
        throw Error('decoded is not object.')
    } 

    const firstKey = Object.keys(decoded)[0];
    const user_email: string = decoded[firstKey];
    return user_email;
}

export async function checkAuth(method: string, authHeader: string | undefined){
    if(method === 'OPTIONS') throw Error('Method is invalid.');

    if (!authHeader || typeof authHeader === 'undefined') {
        throw Error('Auth header missing. Not authenticated.');
    }

    const user_email = await verifyToken(authHeader);
    return user_email
}




