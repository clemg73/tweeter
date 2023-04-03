"use strict";
const _Model_Comment = require('../Model');
const _connection_Comment = require('../../database.js');
const _bdd_Comment = require('../../config/bddConfig');
class _Comment extends _Model_Comment {
    constructor(_id, tweetId, userId, comment, date) {
        super();
        this._id = _id;
        this.tweetId = tweetId;
        this.userId = userId;
        this.comment = comment;
        this.date = date;
    }
    verify() {
        return (this.userId !== undefined && this.comment !== undefined);
    }
}
