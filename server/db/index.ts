import mysql, { type Pool } from "mysql2/promise";
import { v4 } from 'uuid'
import { pbkdf2Sync } from 'pbkdf2'

const runtimeConfig = useRuntimeConfig()

export const read : Pool = mysql.createPool({
  host: runtimeConfig.mysqlReadHost,
  port: runtimeConfig.mysqlReadPort as unknown as number,
  user: runtimeConfig.mysqlReadUser,
  password: runtimeConfig.mysqlReadPassword,
  database: runtimeConfig.mysqlReadDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const write : Pool = mysql.createPool({
  host: runtimeConfig.mysqlWriteHost,
  port: runtimeConfig.mysqlWritePort as unknown as number,
  user: runtimeConfig.mysqlWriteUser,
  password: runtimeConfig.mysqlWritePassword,
  database: runtimeConfig.mysqlWriteDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export function hashPassword(password: string) {
  const salt = v4().replace(/-/g, '').substring(0, 16);
  const pwHash = pbkdf2Sync(password, salt, 1000, 20, 'sha512').toString('hex');
  return `${salt}$${pwHash}`;
}

export function comparePassword(storedPassword: string, submittedPassword: string): boolean {
  const members: string[] = storedPassword.split('$');
  if (members && members.length === 2) {
    const salt          = members[0];
    const storedHash    = members[1];
    const pwHash        = pbkdf2Sync(submittedPassword,
                                      salt,
                                      1000,
                                      20,
                                      'sha512'
                                    ).toString('hex');
    return pwHash === storedHash;
  }
  return false;
}