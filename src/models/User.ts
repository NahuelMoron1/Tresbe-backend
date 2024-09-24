
export class User{
    id: string;
    email: string;
    username: string;
    priceList: string;
    client: boolean;
    seller: string;
    password: string;

    constructor(id: string, email: string, username: string, priceList: string, client: boolean, seller: string, password: string){
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = priceList;
        this.client = client;
        this.seller = seller;
        this.password = password;
    }
}