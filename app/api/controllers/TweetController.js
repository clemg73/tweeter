const Tweet = require('../../Models/entity/Tweet')
const User = require('../../Models/entity/User')

const tweetController = {}
var ObjectId = require('mongodb').ObjectId;

/*
npx tsc 
Test
Documentation
reauthentification
upload image
json de tweetoffollow 
*/ 

tweetController.getTweets = async (req,res)=> {
    try {
        const tweets = await Tweet.getWithFilters()
        let tweetsWithDetails = []
        for (const tweet of tweets) {
            tweet.userDetails = (await User.getWithFilters({"_id":new ObjectId(tweet.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]

            if(tweet.comments){
                for (const comment of tweet.comments) {
                    comment.userDetails = (await User.getWithFilters({"_id":new ObjectId(comment.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]
                }
            }else{
                tweet.retweet = await Tweet.getWithFilters({"_id":new ObjectId(tweet.tweetId)})
                tweet.retweet.userDetails = (await User.getWithFilters({"_id":new ObjectId(req.params.id)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]

            }
            tweetsWithDetails.push(tweet)

        }
        res.status(200).json(tweetsWithDetails)
    } catch (err) {
        throw err
        res.status(400).send({err})
    }
}
tweetController.getTweetsByUserId = async (req,res)=> {
    try {
        if(req.auth.userId == req.params.id)
        {
            const docs = await Tweet.getWithFilters({"userId":req.params.id})
            res.status(200).json(docs)
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
                
                    for (const tweet of tweets) {
                        tweet.userDetails = (await User.getWithFilters({"_id":new ObjectId(req.params.id)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]
    
                        if(tweet.comments){
                            for (const comment of tweet.comments) {
                                comment.userDetails = (await User.getWithFilters({"_id":new ObjectId(comment.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]
                            }
                        }else{
                            tweet.retweet = await Tweet.getWithFilters({"_id":new ObjectId(tweet.tweetId)})
                            tweet.retweet.userDetails = (await User.getWithFilters({"_id":new ObjectId(req.params.id)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0 }))[0]
    
                        }
                        tweetsWithDetails.push(tweet)

                    
                    }
                }
                
            }
            res.status(200).json(tweetsWithDetails)
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
        const tweet = await Tweet.getWithFilters({"_id":new ObjectId(req.params.id)})
        if(tweet.userId == req.auth.userId)
        {
            const docs = await Tweet.updateMany({"_id":new ObjectId(req.params.id)}, { $inc: { "numLike": req.body.numLike } })
            let resp = null
            if(req.body.numLike > 0){
                resp = await User.updateMany({"_id":new ObjectId(req.body.userId)}, { $push: { likesTweet: req.params.id } })
            }else{
                resp = await User.updateMany({"_id":new ObjectId(req.body.userId)}, { $pull: { likesTweet: req.params.id } })
            }
            if(docs == 0 || !resp)
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
tweetController.deleteTweetsById = async (req,res)=> {
    try {
        const tweet = await Tweet.getWithFilters({"_id":new ObjectId(req.params.id)})
        if(tweet.userId == req.auth.userId)
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
