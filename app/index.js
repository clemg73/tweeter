const express = require('express')
const app = express()
app.use(express.json())

var tweetRoutes = require('./api/routes/TweetRoutes');
app.use('/tweets', tweetRoutes);

var userRoutes = require('./api/routes/UserRoutes');
app.use('/users', userRoutes);

var conversationRoutes = require('./api/routes/ConversationRoutes');
app.use('/conversation', conversationRoutes);

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(8080, () => {console.log("Serveur à l'écoute")})