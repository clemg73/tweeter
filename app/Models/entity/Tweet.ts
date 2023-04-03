const _ModelTweet = require('../Model')
const _connectionTweet = require('../../database.js')
const _bddTweet = require('../../config/bddConfig')

class Tweet extends _ModelTweet{

    _id:String
    userId:String
    message:String
    numLike:Number
    numRetweet:Number
    date:Date
    comments:_Comment[]
    
    constructor(_id:String, userId:String, message:String, numLike:Number, numRetweet:Number, date:Date, comments:_Comment[]) {
        super()
        this._id = _id
        this.userId = userId
        this.message = message
        this.numLike = numLike
        this.numRetweet = numRetweet
        this.date = date
        this.comments = comments
    }
   
    verify(){
        return (this.userId !== undefined && this.message !== undefined && this.date !== undefined)
    }

   
}

module.exports = Tweet

