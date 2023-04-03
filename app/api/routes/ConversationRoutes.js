const conversationController = require('../controllers/ConversationController')
var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');

//Routes pour le controller conversation
router.post('/', auth, conversationController.postConversation)
router.put('/(:id)', auth, conversationController.addMessage)
router.get('/getbyuserid/(:id)', auth, conversationController.getConversationByUserId)



module.exports = router;