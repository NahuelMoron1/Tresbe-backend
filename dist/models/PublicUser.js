"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicUser = void 0;
class PublicUser {
    constructor(id, email, username, pricelist, client) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = pricelist;
        this.client = client;
    }
}
exports.PublicUser = PublicUser;
