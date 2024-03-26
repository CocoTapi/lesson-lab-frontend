import express from "express";
import { signUp, login, getUserDataFromGoogle, oAuthLogin } from "./auth";
import { asyncHandler } from "../util/route-util";
import { LoginInfo, SignUpInfo } from "../util/types";
import env from "dotenv";

env.config();

const router = express.Router();

router.post("/signup", asyncHandler(async (req, res) => {
    const signUpInfo: SignUpInfo = req.body;
    console.log(signUpInfo);
    await signUp(signUpInfo);
    res.status(200).json({ message: 'Successfully created user.' })
}));

router.post("/login", asyncHandler(async (req, res) => {
    const loginInfo: LoginInfo = req.body;
    const userDetails = await login(loginInfo);
    res.status(200).json({ message: 'Successfully logged in with user credentials.', userDetails })
}));

//cliant info



//create the url for google login and send it back to the frontend
router.post("/oauth", asyncHandler(async (req, res) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000/auth');
    // res.header("Referrer-Policy", 'no-referrer-when-downgrade');

    const redirectUrl = await oAuthLogin()
    res.status(200).json({ redirectUrl })
    // res.json({ url: authorizeUrl });
}));

router.get("/auth/google", asyncHandler(async function (req, res) {
    // const code: string = req.query.code as string;
    // if (!code) res.status(400).json({ message: 'Authorization code is missing' });

    // const token = await oAuth2Client.getToken(code);

    // //allows the client to use the access token
    // // await oAuth2Client.setCredentials(token.tokens);

    // const user = oAuth2Client.credentials;
    // const userData = await getUserDataFromGoogle(user.access_token);

    // //await oAuthToDB(userData);

    // res.status(200).json({
    //     message: "Success",
    //     data: userData.given_name
    // })
}))

export default router;