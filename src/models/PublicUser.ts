export class PublicUser {
    id: string;
    email: string;
    username: string;
    pricelist: string;
    client: string;

    constructor(id: string, email: string, username: string, pricelist: string, client: string){
        this.id = id;
        this.email = email;
        this.username = username;
        this.pricelist = pricelist;
        this.client = client;
    }
}