"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUser = void 0;
class PublicUser {
    constructor(id, email, username, pricelist, client, seller) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = pricelist;
        this.client = client;
        this.seller = seller;
    }
}
exports.PublicUser = PublicUser;
