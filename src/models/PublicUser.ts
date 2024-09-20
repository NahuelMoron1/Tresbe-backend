export class PublicUser {
    id: string;
    email: string;
    username: string;
    pricelist: string;
    client: boolean;
    seller: string;

    constructor(id: string, email: string, username: string, pricelist: string, client: boolean, seller: string){
        this.id = id;
        this.email = email;
        this.username = username;
        this.pricelist = pricelist;
        this.client = client;
        this.seller = seller;
    }
}