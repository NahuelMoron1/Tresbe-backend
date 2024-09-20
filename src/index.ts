import Server from "./models/server";
import dotenv from 'dotenv';
require('dotenv').config();
dotenv.config();

console.log(process.env.MAINTENANCE);
const server = new Server();