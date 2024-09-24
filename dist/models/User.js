"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, username, priceList, client, seller, password) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = priceList;
        this.client = client;
        this.seller = seller;
        this.password = password;
    }
}
exports.User = User;
