import Database from "../database/Database";
import bcrypt from "bcrypt";
import { LoginInfo, SignUpInfo, UserInfo } from "../util/types";

const db = Database.db;
const saltRounds = 10;

export async function signUp({ email, password, firstName, lastName }: SignUpInfo) {

  const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (checkResult.rows.length > 0) throw new Error("User already exists.");

  const date = new Date();
  const hashResult = await bcrypt.hash(password, saltRounds);
  if (!hashResult) throw new Error('Password hash fail. User not created')

  await db.query(
    "INSERT INTO users (email, password, first_name, last_name, created_date, last_update) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [email, hashResult, firstName, lastName, date, date]
  );

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