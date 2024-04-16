import Database from "../database/Database";
import bcrypt from "bcrypt";
import { LoginInfo, SignUpInfo, ErrorMessage } from "../util/types";
import env from 'dotenv';
import { OAuth2Client } from "google-auth-library";
import { isValidEmail, isValidPassword, isValidText } from "../util/validation";

env.config();

const redirectUrl = 'http://localhost:8080/auth/google';

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUrl
);

const domainRedirect = {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  access_type: 'offline',
    // 'online': Will only get an access token. This is useful if you only need to authenticate the user once. Examples include sign-in, sign-up, and password reset.
		// 'offline': Will get an access token and a refresh token. This is useful if you need to authenticate the user multiple times. Examples include sending emails, accessing user data, and updating user data.
	prompt: 'consent', // 'none' (default), 'consent', 'select_account', or 'consent select_account'. The differences between these are as follows:
		// 'none': Will never prompt the user for authorization. If the user has not previously authorized the application, the user will be redirected to the consent screen.
		// 'consent': Will always prompt the user for consent. This is useful if you need to ensure that the user sees the consent screen.
		// 'select_account': Will prompt the user to select an account. This allows multiple accounts to be signed in.
		// 'consent select_account': Will prompt the user to select an account and to consent to the requested scopes. This allows multiple accounts to be signed in.
}

const db = Database.db;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

export async function checkValidation({ email, password, firstName, lastName }: SignUpInfo) {
  const errors : ErrorMessage = {};

  const emailValidity = isValidEmail(email);
  const passwordValidity = isValidPassword(password, 8);
  const firstNameValidity = isValidText(firstName);
  const lastNameValidity = isValidText(lastName);

  if (!emailValidity) errors.email = "Invalid email.";

  if (passwordValidity.length === false) errors.length = "Invalid password length. Must be at least 8 characters long.";
  if (passwordValidity.simbol === false) errors.simbol = "Invalid password. Must be at least one simbol in your password.";
  if (passwordValidity.num === false) errors.num = "Invalid password. Must be at least one number in your password."

  if(!firstNameValidity) errors.firstName = "Invalid first name."
  if(!lastNameValidity) errors.lastName = "Invalid last name."

  if (Object.keys(errors).length > 0) return errors;

  console.log("Passed all validations!");
  return {};
}

export async function signUp({ email, password, firstName, lastName }: SignUpInfo) {


  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  
  if (checkResult.rows.length > 0) throw new Error("User already exists.");

  const date = new Date();
  const hashResult = bcrypt.hashSync(password, saltRounds);
  if (!hashResult) throw new Error('Password hash fail. User not created')

  await db.query(
    "INSERT INTO users (email, password, first_name, last_name, created_date, last_update) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [email, hashResult, firstName, lastName, date, date]
  );

  console.log(email, hashResult, firstName, lastName, date, date);
}

export async function login({ email, password }: LoginInfo) {

  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!(result.rows.length > 0)) throw Error("User doesn't exist.");

  const user = result.rows[0];
  const storedHashedPassword = user.password;

  const bcryptResult = await bcrypt.compare(password, storedHashedPassword);
  if (!bcryptResult) throw new Error(`Incorrect password.`);

  db.query("UPDATE users SET last_login = $1 WHERE user_id = $2", [
    new Date(), user.user_id
  ]);

  delete user.password;

  return user;
}

export async function getUserDataFromEmail(email: string){
  const query = `
    SELECT 
      user_id,
      email
    FROM 
      users
    WHERE 
      email = $1
  `
  const result = await db.query(query, [email]);
  if (!(result.rows.length > 0)) throw Error("User doesn't exist.");

  const userInfo = result.rows[0];
  return userInfo;
}

export async function oAuthLogin(){
  const authUrl = oAuth2Client.generateAuthUrl(domainRedirect);
  if(!authUrl) throw new Error ("Auth URL could not be generated");

  console.log("authUrl: ",authUrl);

  return authUrl; 
}

export async function generateTokens(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);

  // Set the obtained access token on the OAuth2Client to use tokens for different requests with "oAuth2Client"
  await oAuth2Client.setCredentials(tokens)

  const authTokens = oAuth2Client.credentials;
  if(!authTokens) throw Error ("Error getting authTokens");

  console.log("authTokens: ", authTokens);

  return authTokens;
}

export async function getUserDataFromGoogle(token: any): Promise<any> {
  console.log("token: ", token)

  //using id_token
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
    if(!payload) throw new Error('Error getting payload');
    
    console.log("payload", payload);

    // Here, payload contains user information
    const email = payload['email'];
    const firstName = payload['given_name'];
    const lastName = payload['family_name'];

    const isExpired = payload.exp < Date.now() / 1000;
	  if (!payload.exp || isExpired) throw new Error('Token expired');

    //using access_token
    // const response = await fetch(
    //   `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    // )
    // const data: GoogleUser = await response.json() as GoogleUser;
    // const email = data.email;
    // const firstName = data.given_name;
    // const lastName = data.family_name;

  return {email, firstName, lastName};
}


export async function checkOAuthData({email, password, firstName, lastName}: SignUpInfo){
  const date = new Date();

  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  
  
  if (checkResult.rows.length > 0) {
    const user = checkResult.rows[0];
    await db.query("UPDATE users SET last_login = $1 WHERE user_id = $2", [
     date, user.user_id
    ]);
    console.log("Updated login date.")
  } else {
    await db.query(
      "INSERT INTO users (email, password, first_name, last_name, created_date, last_update) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, password, firstName, lastName, date, date]
    );
  
    console.log("registered User:", email, password, firstName, lastName, date, date);
  }
}
