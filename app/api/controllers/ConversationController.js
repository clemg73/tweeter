const Conversation = require('../../Models/entity/Conversation')
const User = require('../../Models/entity/User')

const conversationController = {}
var ObjectId = require('mongodb').ObjectId;

conversationController.postConversation = async (req,res)=> {
    try {
        let conv = new Conversation(null,  req.body.user1Id, req.body.user2Id,[])
        if(!conv.verify())
        {
            res.status(400).json("Un champ est manquant")
        } else{
            if(req.auth.userId == req.body.user1Id || req.auth.userId == req.body.user2Id)
            {
                let verifyUser1 = await User.getWithFilters({"_id":new ObjectId(conv.user1Id)})
                let verifyUser2 = await User.getWithFilters({"_id":new ObjectId(conv.user2Id)})

                if(verifyUser1.length == 0 || verifyUser2.length == 0)
                    res.status(400).send("Ids user not founds")
                else
                {
                    const docs = await Conversation.insertMany([conv])
                    res.status(200).json(docs[0])
                }
            }else{
                res.status(401).send("")
            }
        }
    } catch (err) {
        res.status(400).send({err})
    }
}
conversationController.addMessage = async (req,res)=> {
    try {
        let verifyConv = await Conversation.getWithFilters({"_id":req.params.id})
        if(user1Id == req.auth.userId || user2Id == req.auth.userId)
        {
            if(verifyConv.length > 0 && (req.body.sender == "user1" || req.body.sender == "user2") && (req.body.recipient == "user1" || req.body.recipient == "user2") && req.body.sender != req.body.recipient)
            {
                res.status(400).json("Erreur dans les champs de saisie")
            } else{
                let json = {
                    "sender":req.body.sender,
                    "recipient":req.body.recipient,
                    "message":req.body.message
                }
                const docs = await Conversation.updateMany({"_id":new ObjectId(req.params.id)},{ $push: { conversation: json } })
                res.status(200).json(docs)
            }
        }else{
            res.status(401).send("")
        }
        
    } catch (err) {
        res.status(400).send({err})
    }
}
conversationController.getConversationByUserId = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            const convs = await Conversation.getWithFilters({ $or: [ { "user1Id":req.params.id}, { "user2Id":req.params.id} ] })

            for (const conv of convs) {
                conv.user1 = await User.getWithFilters({"_id":new ObjectId(conv.user1Id)},{ password: 0,followers:0, follow:0,likesTweet:0 })
                conv.user2 = await User.getWithFilters({"_id":new ObjectId(conv.user2Id)},{ password: 0,followers:0, follow:0,likesTweet:0 })
                delete conv.user2Id
                delete conv.user1Id
            }
            
            res.status(200).json(convs)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(400).send({err})
    }
}

module.exports = conversationController
