"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINTENANCE = exports.DB_PORT = exports.SECRET_JWT_KEY = exports.admin = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.PORT = void 0;
exports.PORT = process.env.PORT || '4000';
///PRODUCTION///
exports.DB_HOST = process.env.DB_HOST || '127.0.0.1';
exports.DB_USER = process.env.DB_USER || 'nahuelmoron';
exports.DB_PASSWORD = process.env.DB_PASSWORD || 'Cacerola2611@';
exports.DB_NAME = process.env.DB_NAME || 'tresbedistribuidora';
exports.admin = process.env.ADMIN || 'nahuelarielmoron1@gmail.com';
exports.SECRET_JWT_KEY = "contrasena-larga-segura-con-hashes";
exports.DB_PORT = 3306;
if (process.env.DB_PORT) {
    exports.DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
exports.MAINTENANCE = process.env.MAINTENANCE || false;
///TESTING
/*export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_USER = process.env.DB_USER || 'nahuelmoron1';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Cacerola2611@';
export const DB_NAME = process.env.DB_NAME || 'tresbetesting';
export const admin = process.env.ADMIN || 'nahuelarielmoron1@gmail.com';
export const SECRET_JWT_KEY = "contrasena-larga-segura-con-hashes";
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
export const MAINTENANCE = process.env.MAINTENANCE || false;*/ 
