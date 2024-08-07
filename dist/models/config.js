"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PORT = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.PORT = void 0;
exports.PORT = process.env.PORT || '3000';
/*export const DB_HOST = process.env.DB_HOST || 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
export const DB_USER = process.env.DB_USER || 'admin';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Bocajuniors10';
export const DB_NAME = process.env.DB_NAME || 'tresbeapp';
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}*/
exports.DB_HOST = process.env.DB_HOST || 'localhost';
exports.DB_USER = process.env.DB_USER || 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'Bocajuniors10';
exports.DB_NAME = process.env.DB_NAME || 'tresbe';
exports.DB_PORT = 3306;
if (process.env.DB_PORT) {
    exports.DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
