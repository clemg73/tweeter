"use strict";
const _Model_Conversation = require('../Model');
const _connection_Conversation = require('../../database.js');
const _bdd_Conversation = require('../../config/bddConfig');
class Conversation extends _Model_Conversation {
    constructor(_id, user1Id, user2Id, conversation) {
        super();
        this._id = _id;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.conversation = conversation;
    }
    verify() {
        return (this.user1Id !== undefined && this.user2Id !== undefined);
    }
}
module.exports = Conversation;
