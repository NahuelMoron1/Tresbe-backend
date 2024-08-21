export const PORT = process.env.PORT || '3000';
export let DB_HOST: string = '';
if(process.env.DB_HOST){
    DB_HOST = process.env.DB_HOST //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}

export let DB_USER: string = '';
if(process.env.DB_USER){
    DB_USER = process.env.DB_USER //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}

export let DB_PASSWORD: string = '';
if(process.env.DB_PASSWORD){
    DB_PASSWORD = process.env.DB_PASSWORD //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}

export let DB_NAME: string = '';
if(process.env.DB_NAME){
    DB_NAME = process.env.DB_NAME //|| 'database-1.c106g4g4oxyf.us-east-2.rds.amazonaws.com';
}
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) //|| 3306;
}

/*export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'Bocajuniors10';
export const DB_NAME = process.env.DB_NAME || 'tresbe';
export let DB_PORT: number = 3306;
if(process.env.DB_PORT){
    DB_PORT = parseInt(process.env.DB_PORT) || 3306;
}*/