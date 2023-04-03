const tweetController = require('../controllers/TweetController')
var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');

//Routes pour le controller tweet
router.get('/', auth,tweetController.getTweets)
router.get('/(:id)', auth,tweetController.getTweetById)
router.post('/', auth,tweetController.postTweet)
router.delete('/(:id)', auth,tweetController.deleteTweetsById)
router.put('/message/(:id)', auth,tweetController.putMessageTweetById)
router.put('/like/(:id)', auth,tweetController.putLikeTweetById)
router.get('/user/(:id)', auth,tweetController.getTweetsByUserId)
router.get('/followsTweets/(:id)', auth,tweetController.getTweetsOfFollows)
router.put('/comment/(:id)', auth,tweetController.addComments)
router.post('/retweet', auth,tweetController.reTweet)




module.exports = router;