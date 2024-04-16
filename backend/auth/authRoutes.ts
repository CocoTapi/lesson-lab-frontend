import express from "express";
import { 
    signUp, 
    login,
    getUserDataFromEmail,
    getUserDataFromGoogle, 
    oAuthLogin, 
    generateTokens, 
    checkOAuthData, 
    checkValidation 
} from "./auth";
import { asyncHandler } from "../util/route-util";
import { LoginInfo, SignUpInfo, ErrorMessage } from "../util/types";
import { createJSONToken, verifyToken } from "../util/auth";
import env from "dotenv";

const fs = require('fs');
const path = require('path');


env.config();

const router = express.Router();



router.post("/signup", asyncHandler(async (req, res) => {
    const signUpInfo: SignUpInfo = req.body;
    const errors : ErrorMessage = await checkValidation(signUpInfo);
    
    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: "User signup failed due to validation errors.",
            errors,
        })
    }

    await signUp(signUpInfo);
    res.status(200).json({ message: 'Successfully created user.' })
}));

router.post("/login", asyncHandler(async (req, res) => {
    const loginInfo: LoginInfo = req.body;
    const userDetails = await login(loginInfo);
    const token = createJSONToken(userDetails.email);

    res.status(200).json({ 
        message: 'Successfully logged in with user credentials.', 
        data: userDetails,
        token: token
    })
}));

//user info retrieval
router.get('/user', asyncHandler(async (req, res) => {
    if(req.method === 'OPTIONS ') throw Error('Method is invalid.');

    const authHeader = req.headers.authorization;
    if (!req.headers.authorization || typeof authHeader === 'undefined') {
        throw Error('Auth header missing. Not authenticated.');
    }

    const user_email = await verifyToken(authHeader);
    const userInfo = await getUserDataFromEmail(user_email);
    res.status(200).json({ 
        message: 'Successfully got user data from token',
        userInfo: userInfo
     });
}))


//create the url for google login and send it back to the frontend
router.post("/oauth", asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Referrer-Policy", 'no-referrer-when-downgrade');

    const authUrl = await oAuthLogin();
    res.status(200).json({ authUrl });
}));



router.get("/auth/google", asyncHandler(async function (req, res) {
    const code: string = req.query.code as string;
    if (!code) res.status(400).json({ message: 'Authorization code is missing' });

    const tokens = await generateTokens(code);

    const {email, firstName, lastName} = await getUserDataFromGoogle(tokens.id_token);
    
    const password = "google";

    await checkOAuthData({email, password, firstName, lastName});

    //TODO: setup token
    const token = "1345rhgdfjhgav4yug1q4hetkqh345y134thqekrjhvgtkq3h5";
    const filePath = path.join(__dirname, '../redirect.html');

    // Read in the HTML file content
    fs.readFile(filePath, { encoding: 'utf-8' }, (err: any, htmlContent: string) => {
        if (err) {
            console.error('Error reading the HTML file:', err);
            return res.status(500).send('Error loading the authentication page.');
        }

        // Replace the placeholder with the actual token
        const updatedHtmlContent = htmlContent.replace('RETRIEVED_ID_TOKEN', token);

        // Send the modified HTML content as the response
        res.send(updatedHtmlContent);
    });
    // res.send(`<script>window.opener.postMessage({ token: '${token}' }, window.origin); window.close();</script>`);
    // res.status(200).json({
    //     message: "Success",
    //     token: "1345rhgdfjhgav4yug1q4hetkqh345y134thqekrjhvgtkq3h5"
    // })
}))



export default router;