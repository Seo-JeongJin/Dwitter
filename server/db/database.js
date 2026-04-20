import mysql from 'mysql2';
import { config } from '../config.js';

const { host, user, database, password } = config.db;
const pool = mysql.createPool({ host, user, database, password });

export const db = pool.promise();
