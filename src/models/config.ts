export const PORT = process.env.PORT || '3000';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Bocajuniors10';
export const DB_NAME = process.env.DB_NAME || 'tresbe';
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}