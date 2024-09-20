"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, username, pricelist, client, seller, password) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.pricelist = pricelist;
        this.client = client;
        this.seller = seller;
        this.password = password;
    }
}
exports.User = User;
