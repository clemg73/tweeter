"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _ModelUser = require('../Model');
const _connectionUser = require('../../database.js');
const _bddUser = require('../../config/bddConfig');
var ObjectId = require('mongodb').ObjectId;
class User extends _ModelUser {
    constructor(_id, tag, password, pseudo, photo, followers, follow, description, dateInscription, likesTweet) {
        super();
        this._id = _id;
        this.tag = tag;
        this.password = password;
        this.pseudo = pseudo;
        this.photo = photo;
        this.followers = followers;
        this.follow = follow;
        this.description = description;
        this.dateInscription = dateInscription;
        this.likesTweet = likesTweet;
    }
    verify() {
        return (this.tag !== undefined && this.password !== undefined && this.pseudo !== undefined && this.photo !== undefined);
    }
    static getRandoms(sizeRandom) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield _connectionUser.Get();
            return yield _connectionUser.db.collection(_bddUser.collections[obj.constructor.name]).aggregate([{ $sample: { size: parseInt(sizeRandom) } }]).toArray();
        });
    }
}
module.exports = User;
