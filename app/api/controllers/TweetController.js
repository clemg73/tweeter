const Tweet = require('../../Models/entity/Tweet')
const User = require('../../Models/entity/User')
const tweetService = require('../services/tweetService')


const tweetController = {}
var ObjectId = require('mongodb').ObjectId;

/*
COMMANDES
npx tsc 

A FAIRE PRIO 1
faire un like pour la recherche par tag

A FAIRE PRIO 2
Test
Documentation
reauthentification
faire des retweet avec un message en plus
baniere
image dans un tweet
projectino mongo faire avec des 1

*/ 

tweetController.getTweets = async (req,res)=> {
    try {
        const tweets = await Tweet.getWithFilters()
        let tweetsWithDetails = await tweetService.getTweetsDetails(tweets,req.auth)
        res.status(200).json(tweetsWithDetails)
    } catch (err) {
        res.status(400).send({err})
    }
}
tweetController.getTweetsByUserId = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            const tweets = await Tweet.getWithFilters({"userId":req.params.id})
            let tweetsWithDetails = await tweetService.getTweetsDetails(tweets,req.auth)
            res.status(200).json(tweetsWithDetails)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(400).send({err})
    }
}
tweetController.getTweetsOfFollows = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            const followers = await User.getWithFilters({"_id":new ObjectId(req.params.id)})
            let tweetsWithDetails = []
            if(followers != [])
            {
                if(followers[0].follow.length > 0)
                {
                    let obj = {$or:[ ]}
                    followers[0].follow.forEach(element => {
                        obj.$or.push({userId:element.toString()})
                    });
    
                    const tweets = await Tweet.getWithFilters(obj)
                    let tweetsWithDetails = await tweetService.getTweetsDetails(tweets,req.auth)

                    res.status(200).json(tweetsWithDetails)

                }
                
            }
            res.status(200).json([])
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(400).send({err})
    }
}

//--Pas de vérif...
tweetController.getTweetById = async (req,res)=> {
    try {
        const docs = await Tweet.getWithFilters({"_id":new ObjectId(req.params.id)})
        if(docs == 0)
            res.status(404).send("")
        else
            res.status(200).json(docs[0])
    } catch (err) {
        res.status(404).send({err})
    }
}
tweetController.postTweet = async (req,res)=> {
    try {
        if(req.auth.userId == req.body.userId)
        {
            req.body.date = new Date().toISOString()
            let tweet = new Tweet(null,  req.body.userId,  req.body.message, 0, 0,  req.body.date,[])
            if(!tweet.verify())
            {
                verify = false;
                res.status(400).json("Un champ est manquant")
            } else{
                const docs = await Tweet.insertMany([tweet])
                res.status(200).json(docs[0])
            }
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(400).send({err})
    }
}
tweetController.reTweet = async (req,res)=> {
   
    try {
        if(req.auth.userId == req.body.userId)
        {
            if(req.body.userId != undefined && req.body.tweetId != undefined)
            {
                let retweet = {
                    userId: req.body.userId,
                    tweetId: req.body.tweetId,
                    date: new Date().toISOString()
                }
                const docs1 = await Tweet.insertMany([retweet])
                const docs2 = await Tweet.updateMany({"_id":new ObjectId(req.body.tweetId)}, { $inc: { "numRetweet": 1 } })

                let resp = await User.updateMany({"_id":new ObjectId(req.body.userId)}, { $push: { "reTweet": req.body.tweetId } })

                res.status(200).json(docs1[0])
            } else{
                res.status(400).json("Un champ est manquant")
            }
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(400).send({err})
    }
}
tweetController.putMessageTweetById = async (req,res)=> {
    try {
        const tweet = await Tweet.getWithFilters({"_id":new ObjectId(req.params.id)})
        if(tweet.userId == req.auth.userId)
        {
            req.body.date = new Date().toISOString()
            const docs = await Tweet.updateMany({"_id":new ObjectId(req.params.id)}, {$set : {"message":req.body.message}} )
            if(docs == 0)
                res.status(404).send("")
            else
                res.status(200).json(docs)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
tweetController.putLikeTweetById = async (req,res)=> {
    try {
        if(req.body.userId == req.auth.userId)
        {
            let respTweet = null
            let respUser = null
            const userLikes = await User.getWithFilters({"_id":new ObjectId(req.body.userId)},{_id:0,tag:0,pseudo:0,photo:0,followers:0,description:0,dateInscription:0,password: 0,follow:0,reTweet:0 })
            if(req.body.numLike > 0){
                console.log(userLikes)
                if(!(userLikes[0].likesTweet.includes(req.params.id)))
                {
                    respUser = await Tweet.updateMany({"_id":new ObjectId(req.params.id)}, { $inc: { "numLike": req.body.numLike } })
                    respTweet = await User.updateMany({"_id":new ObjectId(req.body.userId)}, { $push: { likesTweet: req.params.id } })
                }
            }else{
                if(userLikes[0].likesTweet.includes(req.params.id))
                {
                    respUser = await Tweet.updateMany({"_id":new ObjectId(req.params.id)}, { $inc: { "numLike": req.body.numLike } })
                    respTweet = await User.updateMany({"_id":new ObjectId(req.body.userId)}, { $pull: { likesTweet: req.params.id } })
                }
            }
            if(respUser == 0 || !respTweet)
                res.status(404).send("")
            else
                res.status(200).json()
        }else{
            res.status(401).send("Pas le bon user")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
tweetController.deleteTweetsById = async (req,res)=> {
    try {
        const tweet = await Tweet.getWithFilters({"_id":new ObjectId(req.params.id)})
        if(tweet[0].userId == req.auth.userId)
        {
            const docs = await Tweet.deleteMany({"_id":new ObjectId(req.params.id)})
            if(docs == 0)
                res.status(404).send("")
            else
                res.status(200).json(docs)
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}
tweetController.addComments = async (req,res)=> {
    try { 
        if(req.auth.userId == req.body.userId)
        {
            req.body.date = new Date().toISOString()
            
            let resp = false

            resp = await Tweet.updateMany({"_id":new ObjectId(req.params.id)}, { $push: { comments: req.body } })
        
            if(!resp)
                res.status(404).send("")
            else
                res.status(200).json()
        
        }else{
            res.status(401).send("")
        }
    } catch (err) {
        res.status(404).send({err})
    }
}

module.exports = tweetController
