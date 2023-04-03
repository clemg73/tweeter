"use strict";
const _ModelTweet = require('../Model');
const _connectionTweet = require('../../database.js');
const _bddTweet = require('../../config/bddConfig');
class Tweet extends _ModelTweet {
    constructor(_id, userId, message, numLike, numRetweet, date, comments) {
        super();
        this._id = _id;
        this.userId = userId;
        this.message = message;
        this.numLike = numLike;
        this.numRetweet = numRetweet;
        this.date = date;
        this.comments = comments;
    }
    verify() {
        return (this.userId !== undefined && this.message !== undefined && this.date !== undefined);
    }
}
module.exports = Tweet;
