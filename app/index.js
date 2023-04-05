const express = require('express')
const app = express()
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

var tweetRoutes = require('./api/routes/TweetRoutes');
app.use('/tweets', tweetRoutes);

var userRoutes = require('./api/routes/UserRoutes');
app.use('/users', userRoutes);

var conversationRoutes = require('./api/routes/ConversationRoutes');
app.use('/conversation', conversationRoutes);

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(8080, () => {console.log("Serveur à l'écoute")})