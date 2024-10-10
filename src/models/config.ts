export const PORT = process.env.PORT || '4000';

///PRODUCTION///
/*export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_USER = process.env.DB_USER || 'nahuelmoron';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Cacerola2611@';
export const DB_NAME = process.env.DB_NAME || 'tresbedistribuidora';
export const admin = process.env.ADMIN || 'nahuelarielmoron1@gmail.com';
export const SECRET_JWT_KEY = "contrasena-larga-segura-con-hashes";
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
export const MAINTENANCE = process.env.MAINTENANCE || false;*/

///TESTING
export const DB_HOST = process.env.DB_HOST || '127.0.0.1';
export const DB_USER = process.env.DB_USER || 'nahuelmoron1';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Cacerola2611@';
export const DB_NAME = process.env.DB_NAME || 'tresbetesting';
export const admin = process.env.ADMIN || 'nahuelarielmoron1@gmail.com';
export const SECRET_JWT_KEY = "contrasena-larga-segura-con-hashes";
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}
export const MAINTENANCE = process.env.MAINTENANCE || false;