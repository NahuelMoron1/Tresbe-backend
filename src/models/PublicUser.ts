export class PublicUser {
    id: string;
    email: string;
    username: string;
    priceList: string;
    client: string;
    seller: string;

    constructor(id: string, email: string, username: string, pricelist: string, client: string, seller: string){
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = pricelist;
        this.client = client;
        this.seller = seller;
    }
}