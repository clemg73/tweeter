const Tweet = require('../../Models/entity/Tweet')
const User = require('../../Models/entity/User')

const tweetService = {}
var ObjectId = require('mongodb').ObjectId;



tweetService.getTweetsDetails = async (tweets,auth)=> {
    let tweetsWithDetails = []
    for (const tweet of tweets) {
        tweet.userDetails = (await User.getWithFilters({"_id":new ObjectId(tweet.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0,reTweet:0 }))[0]

        if(tweet.comments){
            for (const comment of tweet.comments) {
                comment.userDetails = (await User.getWithFilters({"_id":new ObjectId(comment.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0,reTweet:0 }))[0]
            }
        }else{
            tweet.retweet = await Tweet.getWithFilters({"_id":new ObjectId(tweet.tweetId)})
            let userId = await User.getWithFilters({"_id":new ObjectId(tweet.retweet[0].userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0,reTweet:0 })
            tweet.retweet[0].userDetails = userId[0]
            for (const comment of tweet.retweet[0].comments) {
                comment.userDetails = (await User.getWithFilters({"_id":new ObjectId(comment.userId)},{ password: 0,followers:0,follow:0,description:0,dateInscription:0,likesTweet:0,reTweet:0 }))[0]
            }
        }
        if(auth != undefined)
        {
            const userLikes = await User.getWithFilters({"_id":new ObjectId(auth.userId )},{_id:0, password: 0,tag:0,pseudo:0,photo:0,followers:0,follow:0,description:0,dateInscription:0,})
            if(userLikes.length>0){
                if(userLikes[0].likesTweet.includes(tweet._id.toString()))
                    tweet.likeByUser = true
                else
                    tweet.likeByUser = false

                if(userLikes[0].reTweet.includes(tweet._id.toString()))
                    tweet.reTweetByUser = true
                else
                    tweet.reTweetByUser = false
            }
        }
            
        tweetsWithDetails.push(tweet)
    }
    return tweetsWithDetails
}


module.exports = tweetService
