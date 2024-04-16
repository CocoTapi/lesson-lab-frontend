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

function validateJSONToken(token: any) {
    if (!KEY) {
        throw new Error("Token key is not defined.");
    }
    return verify(token, KEY);
}

// export function checkAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
//       if(req.method === 'OPTIONS ') return next();
  
//       const authHeader = req.headers.get('authorization'); 
//       if (!authHeader) {
//           console.log("Auth header missing.");
//           return next(new NotAuthError('Not authenticated.'));
//       }
  
//       if(!authHeader) {
//           console.log("Auth header missing.");
//           return next(new NotAuthError('Not authenticated.'));
//       }
  
//       const authFragments = authHeader.split(' '); 
  
//       if (authFragments.length !== 2) {
//           console.log("Auth header invalid.")
//           return next(new NotAuthError('Not authenticated.'));
//       }
  
//       const authToken = authFragments[1];

//       try {
//         const decoded = validateJSONToken(authToken);
//         req.email = decoded.email;
//       } catch (error){
//         return next(new NotAuthError('Not authenticated.'))
//       }
//   }



