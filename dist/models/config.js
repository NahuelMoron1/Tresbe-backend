"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINTENANCE = exports.DB_PORT = exports.admin = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.PORT = void 0;
exports.PORT = process.env.PORT || '3000';
/*export let DB_HOST: string = '';
if(process.env.DB_HOST){
    DB_HOST = process.env.DB_HOST;
}

export let DB_USER: string = '';
if(process.env.DB_USER){
    DB_USER = process.env.DB_USER;
}

export let DB_PASSWORD: string = '';
if(process.env.DB_PASSWORD){
    DB_PASSWORD = process.env.DB_PASSWORD;
}
export let DB_NAME: string = '';
if(process.env.DB_NAME){
    DB_NAME = process.env.DB_NAME;
}
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT);
}*/
exports.DB_HOST = process.env.DB_HOST || '127.0.0.1';
exports.DB_USER = process.env.DB_USER || 'moronnahuu';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'Cacerola2611@';
exports.DB_NAME = process.env.DB_NAME || 'tresbe';
exports.admin = process.env.ADMIN || 'nahuelarielmoron1@gmail.com';
exports.DB_PORT = 3306;
if (process.env.DB_PORT) {
    exports.DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
exports.MAINTENANCE = process.env.MAINTENANCE || false;
