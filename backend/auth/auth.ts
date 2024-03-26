import Database from "../database/Database";
import bcrypt from "bcrypt";
import { LoginInfo, SignUpInfo, UserInfo, GoogleUser } from "../util/types";
import env from 'dotenv';
import { OAuth2Client } from "google-auth-library";

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
  prompt: 'consent',
}

const db = Database.db;
const saltRounds = parseInt(process.env.SALTROUNDS as string);

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

export async function getUserDataFromGoogle(access_token: any): Promise<any> {
  console.log("access token: ", access_token)
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: access_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
    if(!payload) throw new Error('Error getting payload');

    // Here, payload contains user information
    const userId = payload['sub'];
    const userEmail = payload['email'];
    const userName = payload['name'];

    console.log(userId);
    console.log(userEmail);
    console.log(userName);
  // const response = await fetch(
  //   `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  // )

  // const data: GoogleUser = await response.json() as GoogleUser;
  // console.log("data: ", data);
  return {userId, userEmail, userName};
}

export async function oAuthLogin(){
  const authUrl = oAuth2Client.generateAuthUrl(domainRedirect);
  if(!authUrl) throw new Error ("Auth URL could not be generated");
  console.log(authUrl)
  return authUrl;
 
}
// export async function oAuthToDB(userData){
//   const { email,  given_name, family_name }: GoogleUser = userData;
//   const date = new Date();

//   const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
//     email,
//   ]);
  
  
//   if (checkResult.rows.length > 0) {
//     const user = checkResult.rows[0];
//     db.query("UPDATE users SET last_login = $1 WHERE user_id = $2", [
//      date, user.user_id
//     ]);
//     console.log("Updated login date.")
//   } else {
//     await db.query(
//       "INSERT INTO users (email, password, first_name, last_name, created_date, last_update) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
//       [email, "google", given_name, family_name, date, date]
//     );
  
//     console.log("registered User:", email,  given_name, family_name, date, date);
//   }

//}