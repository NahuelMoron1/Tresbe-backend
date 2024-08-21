"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PORT = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.PORT = void 0;
exports.PORT = process.env.PORT || '3000';
exports.DB_HOST = '';
if (process.env.DB_HOST) {
    exports.DB_HOST = process.env.DB_HOST; //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}
exports.DB_USER = '';
if (process.env.DB_USER) {
    exports.DB_USER = process.env.DB_USER; //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}
exports.DB_PASSWORD = '';
if (process.env.DB_PASSWORD) {
    exports.DB_PASSWORD = process.env.DB_PASSWORD; //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}
exports.DB_NAME = '';
if (process.env.DB_NAME) {
    exports.DB_NAME = process.env.DB_NAME; //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}
exports.DB_PORT = 3306;
if (process.env.DB_PORT) {
    exports.DB_PORT = parseInt(process.env.DB_PORT); //|| 3306;
}
/*export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Bocajuniors10';
export const DB_NAME = process.env.DB_NAME || 'tresbe';
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}*/ 
