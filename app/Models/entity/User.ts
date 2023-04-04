const _ModelUser = require('../Model')
const _connectionUser = require('../../database.js')
const _bddUser = require('../../config/bddConfig')
var ObjectId = require('mongodb').ObjectId;


class User extends _ModelUser{

    _id:String
    tag: String
    password: String
    pseudo: String
    photo:String
    followers:String[]
    follow:String[]
    description:String
    dateInscription:Date
    likesTweet:String[]
    reTweet:String[]
    
    constructor(_id:String, tag:String, password:String, pseudo:String, photo:String, followers:String[], follow:String[], description:String, dateInscription:Date,likesTweet:String[],reTweet:String[]) {
        super()
        this._id = _id
        this.tag = tag
        this.password = password
        this.pseudo = pseudo
        this.photo = photo
        this.followers = followers
        this.follow = follow
        this.description = description
        this.dateInscription = dateInscription
        this.likesTweet = likesTweet
        this.reTweet = reTweet
    }

    verify(){
        return (this.tag !== undefined && this.password !== undefined && this.pseudo !== undefined && this.photo !== undefined)
    }
    static async getRandoms<T>(sizeRandom:string): Promise<T[]>{
        const obj = Object.create(this.prototype)
        await _connectionUser.Get();
        return await _connectionUser.db.collection(_bddUser.collections[obj.constructor.name]).aggregate([{ $sample: { size: parseInt(sizeRandom) } }]).toArray()
    }
   
}

module.exports = User