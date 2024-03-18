import express from "express";
import { signUp, login, getUserDataFromGoogle } from "./auth";
import { asyncHandler } from "../util/route-util";
import { LoginInfo, SignUpInfo } from "../util/types";
import { OAuth2Client } from 'google-auth-library';
import env from "dotenv"

env.config();

const router = express.Router();

router.post("/sign-up", asyncHandler(async (req, res) => {
    const signUpInfo: SignUpInfo = req.body;
    await signUp(signUpInfo);
    res.status(200).json({ message: 'Successfully created user.' })
}));

router.post("/login", asyncHandler (async (req, res) => {
    const loginInfo: LoginInfo = req.body;
    const userDetails = await login(loginInfo);
    res.status(200).json({ message: 'Successfully logged in with user credentials.', userDetails })
}));

//create the url for google login and send it back to the frontend
router.post("/oauth", asyncHandler(async (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/login');
    res.header("Referrer-Policy", 'no-referrer-when-downgrade');

    const redirectUrl = 'http://localhost:8080/auth/google';

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        prompt: 'consent'
    });

    res.json({url: authorizeUrl});
}))


router.get("/oauth", asyncHandler(async function(req, res) {
    const code: string | undefined = req.query.code as string;

    if (code) {
        const redirectUrl = 'http://localhost:8080/auth/google';
        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );

        const token = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(token.tokens);
        const user = oAuth2Client.credentials;
        console.log(`credentials: ${user}`);

        const userData = await getUserDataFromGoogle(user.access_token);
        console.log(userData);
    } else {
        res.status(400).json({message: 'Authorization code is missing'});
    }
        

}))

export default router;